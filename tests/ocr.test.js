const test=require("node:test");
const assert=require("node:assert/strict");
const core=require("../ocr-core.js");
test("OCR normalization preserves Korean number and letters",()=>{
 assert.equal(core.normalizeText(" 제주특별자치도  제주시\t중앙로 1 \r\n 101동  "), "제주특별자치도 제주시 중앙로 1 \n 101동");
});
test("Candidate ranking prefers actual address, not a name or lease price",()=>{
 const out=core.extractCandidates([
  {text:"성명 김철수\n보증금 20000000원\n제주특별자치도 제주시 중앙로 1",confidence:73,source:"original"},
  {text:"제주특별자치도 제주시 중앙로 1",confidence:89,source:"contrast"},
  {text:"Phone 010-1234-5678",confidence:98,source:"binary"}
 ]);
 assert.equal(out[0].text,"제주특별자치도 제주시 중앙로 1");
 assert.ok(!out.some(x=>x.text.includes("010-")));
});
test("No made-up address generated when OCR fails",()=>{
 assert.deepEqual(core.extractCandidates([{text:"손글씨를 판독할 수 없습니다",confidence:5}]),[]);
 assert.equal(core.confidenceHint([]),"none");
});
test("Handwriting-like multi-line candidate joins address tokens only",()=>{
 const got=core.extractCandidates([{text:"제주특별자치도 제주시\n중앙로 1",confidence:42}]);
 assert.ok(got.some(x=>x.text==="제주특별자치도 제주시 중앙로 1"));
});
test("Pixel preprocessing transforms grayscale, keeps sizes and alpha",()=>{
 const source=new Uint8ClampedArray([250,250,250,255,12,14,18,255,150,90,90,255,230,230,230,255]);
 for(const mode of ["grayscale","contrast","binary","sharpen"]){
   const result=core.enhancePixels(source,2,2,mode);
   assert.equal(result.length,16);assert.equal(result[3],255);assert.equal(result[7],255);
   assert.equal(result[0],result[1]);assert.equal(result[1],result[2]);
 }
 assert.throws(()=>core.enhancePixels(source,0,2,"binary"));
});
test("Low confidence handwriting cannot be presented as verified",()=>{
 assert.equal(core.confidenceHint([{text:"제주시 중앙로 1",score:61,confidence:43}]),"low");
 assert.equal(core.confidenceHint([{text:"제주시 중앙로 1",score:96,confidence:95}]),"medium");
});
test("sharpen enhancement preserves pixel shape and edge quality diagnostics",()=>{
 const pixels=new Uint8ClampedArray(12*12*4);
 for(let y=0;y<12;y++)for(let x=0;x<12;x++){const k=(y*12+x)*4,ink=(x%4===0||y%4===0)?0:255;pixels.set([ink,ink,ink,255],k);}
 const sharper=core.enhancePixels(pixels,12,12,"sharpen");
 assert.equal(sharper.length,pixels.length);
 const metric=core.imageQuality(pixels,12,12);
 assert.ok(metric.edgeScore>8);
 assert.equal(metric.likelyBlurry,false);
 const blank=new Uint8ClampedArray(12*12*4).fill(255);
 const blankQuality=core.imageQuality(blank,12,12);
 assert.equal(blankQuality.likelyBlurry,true);
});
