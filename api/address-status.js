"use strict";
// Only discloses readiness, never the key or its length.
module.exports=async function handler(req,res){
  res.setHeader("Cache-Control","no-store, max-age=0");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({code:"METHOD_NOT_ALLOWED"});}
  return res.status(200).json({
    service:"JUSOYUNO",
    addressApi:"MOIS_JUSO",
    configured:Boolean(String(process.env.JUSO_API_KEY||"").trim()),
    liveQueryTested:false,
    note:"configured=true indicates key presence only, not validity"
  });
};
