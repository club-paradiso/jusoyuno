"use strict";
/**
 * OPTIONAL Azure Vision Read (Korean handwriting) OCR.
 * Invoked ONLY after explicit client consent; NO image persistence.
 * The caller must crop to address only. Provision firewall rule before enabling.
 */
const crypto=require("node:crypto");
const MAX_BYTES=1500000;
const uploads=new Map();
function send(res,code,data){res.setHeader("Cache-Control","no-store");res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("X-Content-Type-Options","nosniff");return res.status(code).json(data);}
function configured(){return process.env.HANDWRITING_ENABLED==="true"&&Boolean(process.env.AZURE_VISION_KEY&&process.env.AZURE_VISION_ENDPOINT);}
function azureUrl(raw){
 let url;
 try{url=new URL(raw);}catch(_){return null;}
 if(url.protocol!=="https:"||url.username||url.password||url.port||url.pathname!=="/"||url.search||url.hash)return null;
 if(!/^[a-z0-9-]+\.cognitiveservices\.azure\.com$/i.test(url.hostname)&&!/^[a-z0-9-]+\.api\.cognitive\.microsoft\.com$/i.test(url.hostname))return null;
 return url.origin+"/computervision/imageanalysis:analyze?api-version=2024-02-01&features=read";
}
function isJpeg(bytes){return bytes.length>24&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255;}
function rateLimited(req,now=Date.now()){
 const xff=String(req.headers?.["x-forwarded-for"]||"").split(",")[0];
 const ip=String(req.socket?.remoteAddress||xff||"unknown");
 const id=crypto.createHash("sha256").update(ip).digest("hex").slice(0,24);
 if(uploads.size>400)for(const [k,v] of uploads)if(now-v.start>60000)uploads.delete(k);
 const b=uploads.get(id);
 if(!b||now-b.start>60000){uploads.set(id,{start:now,count:1});return false;}
 b.count++;return b.count>4;
}
function parseLines(json){
 const blocks=json?.readResult?.blocks;
 if(!Array.isArray(blocks))return [];
 return blocks.flatMap(b=>Array.isArray(b.lines)?b.lines:[]).slice(0,20).map(l=>({
  text:String(l.text||"").replace(/[\r\n]+/g," ").slice(0,150),
  confidence:Array.isArray(l.words)&&l.words.length?Math.round(l.words.reduce((s,w)=>s+(Number(w.confidence)||0),0)/l.words.length*100):null
 })).filter(l=>l.text);
}
async function handler(req,res){
 res.setHeader("Referrer-Policy","no-referrer");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{code:"METHOD_NOT_ALLOWED"});}
 if(!configured())return send(res,503,{code:"HANDWRITING_NOT_CONFIGURED"});
 if(req.headers?.["x-ocr-consent"]!=="true")return send(res,403,{code:"CONSENT_REQUIRED"});
 // Not a substitute for a firewall: reject cross-site browser posts.
 const origin=req.headers?.origin;
 const host=req.headers?.host;
 if(origin&&host&&origin!=="https://"+host)return send(res,403,{code:"ORIGIN_REJECTED"});
 if(req.headers?.["content-type"]&&!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"]))return send(res,415,{code:"INVALID_IMAGE"});
 if(Number(req.headers?.["content-length"]||0)>2250000)return send(res,413,{code:"IMAGE_TOO_LARGE"});
 if(rateLimited(req)){res.setHeader("Retry-After","60");return send(res,429,{code:"RATE_LIMITED"});}
 const body=typeof req.body==="string"?JSON.parse(req.body):req.body;
 if(!body||typeof body.image!=="string"||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(body.image)||body.image.length>2050000)return send(res,400,{code:"INVALID_IMAGE"});
 const base64=body.image.slice("data:image/jpeg;base64,".length);
 const bytes=Buffer.from(base64,"base64");
 if(bytes.length>MAX_BYTES||!isJpeg(bytes))return send(res,413,{code:"IMAGE_TOO_LARGE"});
 const endpoint=azureUrl(String(process.env.AZURE_VISION_ENDPOINT||""));
 if(!endpoint)return send(res,503,{code:"HANDWRITING_NOT_CONFIGURED"});
 try{
  // No image, URL or raw address text is logged, cached or saved by JUSOYUNO.
  const response=await fetch(endpoint,{
   method:"POST",headers:{"Ocp-Apim-Subscription-Key":process.env.AZURE_VISION_KEY,"Content-Type":"application/octet-stream","Accept":"application/json"},
   body:bytes,signal:AbortSignal.timeout(11500),cache:"no-store",redirect:"error"
  });
  if(!response.ok)return send(res,response.status===429?429:502,{code:response.status===429?"PROVIDER_RATE_LIMIT":"HANDWRITING_PROVIDER_ERROR"});
  const json=await response.json();
  const lines=parseLines(json);
  return send(res,200,{code:"OK",engine:"AZURE_VISION_READ",lines,unverified:true});
 }catch(e){return send(res,502,{code:e?.name==="TimeoutError"?"HANDWRITING_TIMEOUT":"HANDWRITING_PROVIDER_ERROR"});}
}
module.exports=handler;
module.exports.parseLines=parseLines;
module.exports.azureUrl=azureUrl;
module.exports._clearLimit=()=>uploads.clear();