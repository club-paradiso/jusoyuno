"use strict";
module.exports=function(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({code:"METHOD_NOT_ALLOWED"});}
 return res.status(200).json({
  enabled:process.env.HANDWRITING_ENABLED==="true"&&Boolean(process.env.AZURE_VISION_KEY&&process.env.AZURE_VISION_ENDPOINT),
  provider:"AZURE_VISION_READ",
  externalTransfer:true,
  readyMeansConfiguredOnly:true
 });
};