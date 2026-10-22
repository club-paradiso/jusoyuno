const test=require("node:test");
const assert=require("node:assert/strict");
const handler=require("../api/address.js");
const statusHandler=require("../api/address-status.js");
const DEFAULT={keyword:"제주시 중앙로 1"};

function harness(method="POST",body=DEFAULT,headers={}){
  let status=200,response,headersOut={};
  return {
    req:{method,body,headers},
    res:{
      setHeader(key,value){headersOut[key]=value;},
      status(code){status=code;return this;},
      json(data){response=data;return this;}
    },
    output(){return {status,response,headers:headersOut};}
  };
}
async function inKeyContext(key,upstream,run){
  const originalKey=process.env.JUSO_API_KEY,originalFetch=global.fetch;
  if(key===null)delete process.env.JUSO_API_KEY;else process.env.JUSO_API_KEY=key;
  if(upstream)global.fetch=upstream;
  try{await run();}finally{
    if(originalKey===undefined)delete process.env.JUSO_API_KEY;
    else process.env.JUSO_API_KEY=originalKey;
    global.fetch=originalFetch;
  }
}
const fakeResponse=(code="0",items=[])=>({ok:true,json:async()=>({results:{common:{errorCode:code},juso:items}})});

test("rejects GET, invalid bodies, oversized payloads and non-JSON media",async()=>{
  const calls=[
    harness("GET"),harness("POST",{}),harness("POST",{keyword:"1"}),
    harness("POST",{keyword:"x".repeat(81)}),
    harness("POST",{keyword:"<script>"}),
    harness("POST",{keyword:"010-1234-5678"}),
    harness("POST",{keyword:"private@example.org"}),
    harness("POST",{keyword:"900101-1234567"}),
    harness("POST",{keyword:"1234567890"}),
    harness("POST",DEFAULT,{"content-type":"text/plain"}),
    harness("POST",DEFAULT,{"content-length":"9000"})
  ];
  const codes=[405,400,400,400,400,400,400,400,400,415,413];
  for(let i=0;i<calls.length;i++){
    await handler(calls[i].req,calls[i].res);
    assert.equal(calls[i].output().status,codes[i]);
  }
});
test("missing key fails closed and readiness check never reveals a key",async()=>{
  await inKeyContext(null,null,async()=>{
    const x=harness();await handler(x.req,x.res);
    assert.equal(x.output().status,503);
    assert.equal(x.output().response.code,"NOT_CONFIGURED");
    const health=harness("GET");await statusHandler(health.req,health.res);
    assert.equal(health.output().response.configured,false);
    assert.equal("key" in health.output().response,false);
  });
});
test("correct URL, form request and Korean/English address field mapping",async()=>{
  await inKeyContext("dev-example-key",async(url,options)=>{
    assert.equal(url,"https://business.juso.go.kr/addrlink/addrLinkApi.do");
    assert.equal(options.method,"POST");
    assert.equal(new URLSearchParams(options.body).get("confmKey"),"dev-example-key");
    assert.equal(new URLSearchParams(options.body).get("keyword"),DEFAULT.keyword);
    assert.equal(new URLSearchParams(options.body).get("resultType"),"json");
    return fakeResponse("0",[{roadAddrPart1:"제주특별자치도 제주시 중앙로 1",engAddr:"1, Jungang-ro, Jeju-si, Jeju-do",zipNo:"63166",jibunAddr:"제주시 이도일동",bdNm:"건물"}]);
  },async()=>{
    const x=harness();await handler(x.req,x.res);
    assert.equal(x.output().status,200);
    assert.deepEqual(x.output().response.results[0],{
      roadAddr:"제주특별자치도 제주시 중앙로 1",
      engAddr:"1, Jungang-ro, Jeju-si, Jeju-do",
      jibunAddr:"제주시 이도일동",
      zipNo:"63166",
      buildingName:"건물"
    });
    assert.equal(x.output().response.verifiedBaseOnly,true);
  });
});
test("empty official search response is valid, not fabricated",async()=>{
  await inKeyContext("key",async()=>fakeResponse("0",[]),async()=>{
    const x=harness();await handler(x.req,x.res);
    assert.equal(x.output().status,200);assert.deepEqual(x.output().response.results,[]);
  });
});
test("wrong key, expired key, rejected query and provider outages differ",async()=>{
  for(const [apiCode,expectedHttp,expectedCode] of [
    ["E0001",503,"JUSO_AUTH_FAILED"],["E0014",503,"JUSO_AUTH_FAILED"],
    ["E0006",422,"JUSO_QUERY_REJECTED"],["E0015",422,"JUSO_QUERY_REJECTED"],
    ["-999",502,"UPSTREAM_UNAVAILABLE"]
  ]){
    await inKeyContext("key",async()=>fakeResponse(apiCode),async()=>{
      const x=harness();await handler(x.req,x.res);
      assert.equal(x.output().status,expectedHttp);
      assert.equal(x.output().response.code,expectedCode);
    });
  }
  await inKeyContext("key",async()=>({ok:true,json:async()=>{throw new Error("bad json")}}),async()=>{
    const x=harness();await handler(x.req,x.res);
    assert.equal(x.output().response.code,"UPSTREAM_BAD_RESPONSE");
  });
});
test("no key or entered identity number ever leaves the browser/server as lookup request",async()=>{
  await inKeyContext(null,()=>{throw new Error("Should not call upstream");},async()=>{
    const x=harness("POST",{keyword:"900101-1234567"});
    await handler(x.req,x.res);assert.equal(x.output().response.code,"SENSITIVE_QUERY");
  });
});
