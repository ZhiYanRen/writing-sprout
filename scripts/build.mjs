import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
async function walk(dir){const paths=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;paths.push(...(e.isDirectory()?await walk(p):[p]));}return paths;}
const files=(await walk('dist')).filter(p=>!p.endsWith('/sw.js'));
const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));
const version=hash.digest('hex').slice(0,12);
const sw=await readFile('public/sw.js','utf8');await writeFile('dist/sw.js',sw.replace('__VERSION__',version).replace('__FILES__',JSON.stringify(files.map(f=>'./'+f.slice(5)))));
console.log(`Built ${files.length+1} static files → dist/ (${version})`);
