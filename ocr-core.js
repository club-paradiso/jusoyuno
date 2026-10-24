/* JUSOYUNO local OCR utilities. Pure, dependency-free, browser + Node. */
(function(root,factory){
  const api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root)root.JusoOCRCore=api;
})(typeof window!=="undefined"?window:undefined,function(){
"use strict";
const LOCATION=/(?:특별자치도|광역시|특별시|제주시|서귀포시|서울|부산|인천|대구|울산|대전|광주|세종|경기|강원|충북|충남|경북|경남|전북|전남|제주|[가-힣]{2,7}(?:시|군|구|읍|면|동|리))/;
const ROAD=/(?:[가-힣0-9]{1,20}(?:대로|로|길|번길|거리)|(?:산|번지)\s*\d+)/;
const UNSAFE=/(?:\b\d{6}[-\s]?\d{7}\b|\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i;
function normalizeText(text){
 return String(text||"").normalize("NFKC").replace(/[\u200b-\u200f\ufeff]/g,"").replace(/[｜|]/g," ")
 .replace(/[\t\u00a0]+/g," ").replace(/\r\n?/g,"\n").replace(/ +/g," ").trim();
}
function sanitizeLine(text){
 return normalizeText(text).replace(/^[\s:：,.;·'"‘’“”\[\]()]+|[\s:：,.;·'"‘’“”\[\]()]+$/g,"").slice(0,120);
}
function scoreLine(text,confidence){
 const s=sanitizeLine(text);
 if(s.length<3||s.length>120||UNSAFE.test(s))return -100;
 const korean=(s.match(/[가-힣]/g)||[]).length;
 const digits=(s.match(/\d/g)||[]).length;
 const road=ROAD.test(s),loc=LOCATION.test(s);
 let score=(road?32:0)+(loc?19:0)+(digits?14:0)+Math.min(15,korean*1.2);
 if(korean<2)score-=22;
 if(s.length>80)score-=25;
 if(/(?:이름|성명|주민등록|전화|연락처|성별|계약금|보증금|서명|passport|name|phone)/i.test(s))score-=30;
 if(typeof confidence==="number"&&Number.isFinite(confidence))score+=Math.max(0,Math.min(100,confidence))*0.16;
 if(!road)score-=7; // 지번주소는 수동 확인이 필요할 수 있음
 return Math.round(score);
}
function extractCandidates(records,max=6){
 const candidates=new Map();
 function add(text,confidence,source){
   const cleaned=sanitizeLine(text);
   const rating=scoreLine(cleaned,confidence);
   if(rating<15)return;
   const key=cleaned.replace(/[\s,·]+/g,"").toLowerCase();
   const old=candidates.get(key);
   if(!old||old.score<rating){
    candidates.set(key,{text:cleaned,score:rating,confidence:Number.isFinite(Number(confidence))?Number(confidence):null,source:source||"local"});
   }else if(old){old.votes=(old.votes||1)+1;}
 }
 for(const rec of Array.isArray(records)?records:[]){
   const raw=normalizeText(rec?.text||"");
   const c=typeof rec?.confidence==="number"?rec.confidence:0;
   const lines=raw.split(/\n/g).map(sanitizeLine).filter(Boolean).slice(0,25);
   for(let i=0;i<lines.length;i++){
     add(lines[i],c,rec.source);
     if(i+1<lines.length&&lines[i].length+lines[i+1].length<95){
       // Only combine likely split lines when one has location and the other has road/number.
       if((LOCATION.test(lines[i])&&ROAD.test(lines[i+1]))||(ROAD.test(lines[i])&&/^\d/.test(lines[i+1])))
         add(lines[i]+" "+lines[i+1],c,rec.source);
     }
   }
 }
 return [...candidates.values()].sort((a,b)=>b.score-a.score||b.votes-a.votes).slice(0,max);
}
function confidenceHint(candidates){
 if(!candidates||!candidates.length)return "none";
 const top=candidates[0];
 if(top.score>=75&&top.confidence>=75)return "medium";
 return "low"; // OCR results are never official addresses; no "high" label.
}
// A full road address (location + road + number) read with solid confidence needs no further passes.
function isConfidentRead(candidates){
 const top=candidates&&candidates[0];
 return !!top&&top.score>=85&&typeof top.confidence==="number"&&top.confidence>=75;
}
function enhancePixels(input,width,height,mode="contrast"){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>9000000||input.length!==width*height*4)throw Error("Invalid pixel buffer");
 if(!["grayscale","contrast","binary","sharpen"].includes(mode))throw Error("Unknown preprocessing");
 const out=new Uint8ClampedArray(input.length),gray=new Uint8Array(width*height);
 let avg=0;
 for(let i=0;i<gray.length;i++){
  const p=i*4;
  const v=Math.round(input[p]*0.299+input[p+1]*0.587+input[p+2]*0.114);
  gray[i]=v;avg+=v;
 }
 avg/=gray.length;
 // Apply moderate adaptive contrast with ink-background separation.
 const radius=8, integral=new Float64Array((width+1)*(height+1)),stride=width+1;
 for(let y=1;y<=height;y++){
  let sum=0;
  for(let x=1;x<=width;x++){
   sum+=gray[(y-1)*width+x-1];
   integral[y*stride+x]=integral[(y-1)*stride+x]+sum;
  }
 }
 for(let y=0;y<height;y++){
  const y0=Math.max(0,y-radius),y1=Math.min(height-1,y+radius);
  for(let x=0;x<width;x++){
   const x0=Math.max(0,x-radius),x1=Math.min(width-1,x+radius);
   const local=(integral[(y1+1)*stride+x1+1]-integral[y0*stride+x1+1]-integral[(y1+1)*stride+x0]+integral[y0*stride+x0])/((x1-x0+1)*(y1-y0+1));
   const v=gray[y*width+x],p=(y*width+x)*4;
   let value;
   if(mode==="grayscale") value=v;
   else if(mode==="contrast") value=Math.max(0,Math.min(255,(v-local)*1.75+Math.max(188,Math.min(235,local+15))));
   else if(mode==="sharpen") value=Math.max(0,Math.min(255,v*1.95-local*0.95+15));
   else value=v<local-10?22:247; // adaptive threshold; best only as fallback
   out[p]=value;out[p+1]=value;out[p+2]=value;out[p+3]=255;
  }
 }
 return out;
}
function imageQuality(input,width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||input.length!==width*height*4)throw Error("Invalid pixel buffer");
 const step=Math.max(1,Math.floor(Math.min(width,height)/300));
 let total=0,count=0,dark=0,light=0;
 for(let y=step;y<height;y+=step)for(let x=step;x<width;x+=step){
  const p=(y*width+x)*4,q=((y-step)*width+x)*4,z=(y*width+x-step)*4;
  const lum=k=>(input[k]*299+input[k+1]*587+input[k+2]*114)/1000;
  const v=lum(p);
  total+=Math.abs(v-lum(q))+Math.abs(v-lum(z));count++;
  if(v<80)dark++;
  if(v>215)light++;
 }
 const edge=count?total/count:0;
 return {edgeScore:Math.round(edge*10)/10,likelyBlurry:edge<8,likelyLowContrast:(dark/count)<0.005&&(light/count)<0.06};
}
return {normalizeText,sanitizeLine,scoreLine,extractCandidates,confidenceHint,isConfidentRead,enhancePixels,imageQuality};
});