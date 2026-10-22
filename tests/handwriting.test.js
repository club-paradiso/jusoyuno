const test=require("node:test");
const assert=require("node:assert/strict");
const handler=require("../api/handwriting.js");
const statusHandler=require("../api/handwriting-status.js");
const envs=["HANDWRITING_ENABLED","AZURE_VISION_ENDPOINT","AZURE_VISION_KEY"];
async function env(obj,run){
 const prior=Object.fromEntries(envs.map(k=>[k,process.env[k]]));
 for(const k of envs)if(obj[k]===undefined)delete process.env[k];else process.env[k]=obj[k];
 try{return await run();}finally{for(const k of envs)if(prior[k]===undefined)delete process.env[k];else process.env[k]=prior[k];}
}
function mock(body={},headers={},method="POST"){
 let code=200,output,headersOut={};
 return {req:{method,body,headers:{host:"jusoyuno-git.vercel.app",...headers},socket:{remoteAddress:"192.0.2.11"}},res:{
  setHeader(k,v){headersOut[k]=v;},status(c){code=c;return this;},json(x){output=x;return this;}
 },result(){return{code,output,headersOut}}};
}
const keys={HANDWRITING_ENABLED:"true",AZURE_VISION_ENDPOINT:"https://safe-region.cognitiveservices.azure.com/",AZURE_VISION_KEY:"synthetic-not-secret"};
test("cloud handwriting disabled unless explicitly configured",async()=>{
 await env({},async()=>{
  let x=mock();await handler(x.req,x.res);assert.equal(x.result().code,503);
  x=mock({},{}, "GET");await statusHandler(x.req,x.res);assert.equal(x.result().output.enabled,false);
 });
});
test("cloud request requires consent, correct origin and valid jpeg",async()=>{
 await env(keys,async()=>{
  let x=mock({image:"test"});await handler(x.req,x.res);assert.equal(x.result().output.code,"CONSENT_REQUIRED");
  x=mock({image:"x"},{"x-ocr-consent":"true",origin:"https://attack.example"});await handler(x.req,x.res);assert.equal(x.result().code,403);
  x=mock({image:"x"},{"x-ocr-consent":"true"});await handler(x.req,x.res);assert.equal(x.result().code,400);
 });
});
test("provider URL requires HTTPS from known Microsoft host",()=>{
 assert.equal(handler.azureUrl("http://evil.example/"),null);
 assert.equal(handler.azureUrl("https://evil.example/"),null);
 assert.equal(handler.azureUrl("https://x.cognitiveservices.azure.com.evil.com/"),null);
 assert.match(handler.azureUrl("https://safe-region.cognitiveservices.azure.com/"),/\/computervision\/imageanalysis:analyze\?/);
});
test("Azure Read lines extraction and confidence",()=>{
 const o=handler.parseLines({readResult:{blocks:[{lines:[{text:"제주특별자치도 제주시 중앙로 1",words:[{confidence:0.7},{confidence:0.9}]},{text:"다른 줄"}]}]}});
 assert.equal(o[0].confidence,80);assert.equal(o[0].text,"제주특별자치도 제주시 중앙로 1");
});
test("only deliberately cropped JPEG reaches Azure, response has no credential",async()=>{
 handler._clearLimit();
 await env(keys,async()=>{
  const original=global.fetch;let called=false;
  global.fetch=async(url,options)=>{called=true;assert.match(url,/features=read/);assert.equal(options.headers["Ocp-Apim-Subscription-Key"],keys.AZURE_VISION_KEY);assert.equal(options.headers["Content-Type"],"application/octet-stream");return{ok:true,json:async()=>({readResult:{blocks:[{lines:[{text:"제주시 중앙로 1",words:[{confidence:0.82}]}]}]}})};};
  try{
   const image=Buffer.from([255,216,255,...new Array(30).fill(5)]).toString("base64");
   const x=mock({image:"data:image/jpeg;base64,"+image},{"x-ocr-consent":"true"});
   await handler(x.req,x.res);assert.equal(x.result().code,200);assert.equal(called,true);
   assert.equal(x.result().output.lines[0].text,"제주시 중앙로 1");
   assert.equal(JSON.stringify(x.result().output).includes(keys.AZURE_VISION_KEY),false);
  }finally{global.fetch=original;}
 });
});