import {findLesson} from './content.js';
export const KEY='writing-sprout-v1';
export function countWords(text){return (text.match(/[\p{Script=Han}]/gu)||[]).length+(text.replace(/[\p{Script=Han}]/gu,' ').match(/[\p{L}\p{N}]+/gu)||[]).length;}
export function parseBackup(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>2*1024*1024)throw Error('备份不能超过 2MB。');
 let data;try{data=JSON.parse(text);}catch{throw Error('这不是有效的 JSON 备份文件。');}
 if(data?.schema!==1||!Array.isArray(data.entries)||data.entries.length>20)throw Error('备份格式不正确，请选择写作芽芽导出的备份。');
 const ids=new Set();
 return data.entries.map(e=>{
  if(!e||typeof e!=='object'||!findLesson(e.id)||ids.has(e.id)||typeof e.title!=='string'||e.title.length>100||typeof e.text!=='string'||e.text.length>20000||!Array.isArray(e.checks)||e.checks.length!==3||e.checks.some(c=>typeof c!=='boolean')||typeof e.completed!=='boolean'||typeof e.updatedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(e.updatedAt)||!Number.isFinite(Date.parse(e.updatedAt))||(e.completed&&(!e.text.trim()||!e.checks.every(Boolean))))throw Error('备份中有无效、重复或过长的作品，未导入任何内容。');
  ids.add(e.id);return {id:e.id,title:e.title,text:e.text,checks:[...e.checks],completed:e.completed,updatedAt:e.updatedAt};
 });
}
export function mergeEntries(current,incoming){return [...current,...incoming.filter(e=>!current.some(c=>c.id===e.id))];}
export class Store{
 constructor(storage){
  this.storage=storage;this.entries=[];this.problem=null;this.lastRaw=null;
  try{this.lastRaw=storage.getItem(KEY);if(this.lastRaw!==null)this.entries=parseBackup(this.lastRaw);}
  catch{this.problem=this.lastRaw===null?'unavailable':'corrupt';}
 }
 save(entries){
  this.entries=entries;
  if(this.problem==='corrupt'||this.problem==='conflict')return false;
  try{
   if(this.storage.getItem(KEY)!==this.lastRaw){this.problem='conflict';return false;}
   const raw=JSON.stringify({schema:1,entries});this.storage.setItem(KEY,raw);this.lastRaw=raw;this.problem=null;return true;
  }catch{this.problem='unavailable';return false;}
 }
}
