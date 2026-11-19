import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(),base=path.join(root,'figma/professional-v6');
const ledger=JSON.parse(await fs.readFile(path.join(root,'tools/design/professional-v6/ledger.json'),'utf8')).screens;
const groups=new Map(),entries=Object.entries(ledger);
sharp.concurrency(2);
for(let at=0;at<entries.length;at+=4){
 await Promise.all(entries.slice(at,at+4).map(async ([key,s])=>{
  await sharp(path.join(base,'full',key+'.png')).flatten({background:'#faf9f6'}).resize({width:480,height:360,fit:'inside'}).jpeg({quality:84}).toFile(path.join(base,'thumbs',key+'.jpg'));
 }));
}
for(const [key,s] of entries){if(!groups.has(s.page))groups.set(s.page,[]);groups.get(s.page).push([key,s]);}
for(const [group,rows] of groups){
 for(let start=0;start<rows.length;start+=20){
  const part=rows.slice(start,start+20),layers=[];
  for(let i=0;i<part.length;i++){
   const [key]=part[i],x=(i%4)*400+12,y=Math.floor(i/4)*310+12;
   const {data,info}=await sharp(path.join(base,'thumbs',key+'.jpg')).resize({width:376,height:260,fit:'inside'}).toBuffer({resolveWithObject:true});
   layers.push({input:data,left:x+Math.floor((376-info.width)/2),top:y+Math.floor((260-info.height)/2)});
   const safe=key.replaceAll('&','&amp;').replaceAll('<','&lt;');
   const label=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="376" height="28"><text x="0" y="18" font-family="DejaVu Sans,sans-serif" font-size="13" fill="#111827">${safe}</text></svg>`);
   layers.push({input:label,left:x,top:y+264});
  }
  await sharp({create:{width:1600,height:310*Math.ceil(part.length/4),channels:3,background:'#e8eae4'}}).composite(layers).jpeg({quality:88}).toFile(path.join(base,'contact-sheets',group+'-'+(Math.floor(start/20)+1)+'.jpg'));
 }
}
console.log(`Generated ${entries.length} thumbnails and ${groups.size} families of contact sheets`);
