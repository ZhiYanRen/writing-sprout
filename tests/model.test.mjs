import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseBackup,mergeEntries,countWords,Store,KEY} from '../public/model.js';
import {lessons} from '../public/content.js';
const entry={id:'park',title:'公园里',text:'春天来了，小朋友在草地上放风筝。',checks:[true,true,true],completed:true,updatedAt:'2026-11-17T01:00:00.000Z'};
const backup=entries=>JSON.stringify({schema:1,entries});
function memory(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};}
test('20 unique lessons have genuine guidance and examples',()=>{assert.equal(lessons.length,20);assert.equal(new Set(lessons.map(l=>l.id)).size,20);for(const l of lessons){assert.equal(l.questions.length,3);assert.equal(l.outline.length,3);assert(l.example.length>20);assert(l.tip.length>8);}});
test('word count ignores punctuation and handles emoji and Latin words',()=>{assert.equal(countWords('你好，世界！  hello world 123 🌱'),7);});
test('backup roundtrip preserves drafts and completion',()=>{assert.deepEqual(parseBackup(backup([entry])),[entry]);});
test('invalid backup rejected without silently dropping records',()=>{for(const value of ['{}','not json',backup([{...entry,id:'unknown'}]),backup([entry,entry]),backup([{...entry,text:'a'.repeat(20001)}]),backup([{...entry,updatedAt:'yesterday'}]),backup([{...entry,checks:[1]}]),backup([{...entry,completed:'yes'}])])assert.throws(()=>parseBackup(value));});
test('oversize backup rejected before parsing',()=>assert.throws(()=>parseBackup(' '.repeat(2*1024*1024+1))));
test('merge never overwrites current work',()=>{const current=[entry];assert.equal(mergeEntries(current,[{...entry,text:'别的文字'}])[0].text,entry.text);assert.equal(mergeEntries([],current).length,1);});
test('storage persists after reload',()=>{const s=memory(),a=new Store(s);assert(a.save([entry]));assert.deepEqual(new Store(s).entries,[entry]);});
test('failed storage retains session work and reports failure',()=>{const a=new Store({getItem:()=>null,setItem:()=>{throw Error('quota');}});assert.equal(a.save([entry]),false);assert.deepEqual(a.entries,[entry]);assert.equal(a.problem,'unavailable');});
test('corrupt storage is never overwritten',()=>{const s=memory();s.setItem(KEY,'broken');const a=new Store(s);assert.equal(a.problem,'corrupt');assert.equal(a.save([entry]),false);assert.equal(s.getItem(KEY),'broken');assert.deepEqual(a.entries,[entry]);});
test('concurrent writer cannot overwrite newer work',()=>{const s=memory(),a=new Store(s),b=new Store(s);assert(a.save([entry]));assert.equal(b.save([{...entry,text:'旧窗口'}]),false);assert.equal(b.problem,'conflict');assert.equal(new Store(s).entries[0].text,entry.text);});
test('rendered lesson art refers to real local assets',async()=>{const {readFile}=await import('node:fs/promises');for(const l of lessons){if(l.type!=='skills')assert((await readFile(new URL(`../public/assets/${l.scene}.svg`,import.meta.url),'utf8')).includes('<svg'));else assert(['pencil','eye','leaf','spark','arrow','check','steps','book'].includes(l.icon),l.icon);}});
