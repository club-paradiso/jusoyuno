"use strict";
async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options","nosniff");
  res.setHeader("Referrer-Policy","no-referrer");
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({code:"METHOD_NOT_ALLOWED"});}
  const body=typeof req.body==="string"?safeParse(req.body):req.body;
  if(!body||typeof body!=="object"||Array.isArray(body)||typeof body.keyword!=="string")return res.status(400).json({code:"INVALID_QUERY"});
  const keyword=body.keyword.trim();
  if(keyword.length<2||keyword.length>150||/[\r\n<>]/.test(keyword))return res.status(400).json({code:"INVALID_QUERY"});
  const key=process.env.JUSO_API_KEY;
  if(!key)return res.status(503).json({code:"NOT_CONFIGURED"});
  try{
    const qs=new URLSearchParams({confmKey:key,currentPage:"1",countPerPage:"8",keyword,resultType:"json"});
    const response=await fetch("https://business.juso.go.kr/addrlink/addrLinkApi.do",{
      method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},
      body:qs.toString(),signal:AbortSignal.timeout(7500),cache:"no-store"
    });
    if(!response.ok)return res.status(502).json({code:"UPSTREAM_FAILURE"});
    const data=await response.json();
    if(String(data?.results?.common?.errorCode)!=="0")return res.status(502).json({code:"UPSTREAM_ERROR"});
    const list=Array.isArray(data?.results?.juso)?data.results.juso:[];
    const results=list.slice(0,8).map(a=>({
      roadAddr:String(a.roadAddrPart1||a.roadAddr||"").slice(0,300),
      engAddr:String(a.engAddr||"").slice(0,300),
      zipNo:String(a.zipNo||"").slice(0,8)
    })).filter(a=>a.roadAddr);
    return res.status(200).json({results,source:"MOIS_JUSO",verifiedBaseOnly:true});
  }catch(_){return res.status(502).json({code:"UPSTREAM_FAILURE"});}
}
function safeParse(s){try{return JSON.parse(s);}catch(_){return null;}}
module.exports=handler;