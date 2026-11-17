import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist'),port=Number(process.env.PORT||4186);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'};
createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!pathname.startsWith('/writing-sprout/')){res.writeHead(302,{Location:'/writing-sprout/'}).end();return;}const file=path.resolve(root,'.'+pathname.slice('/writing-sprout'.length));if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}const target=(await stat(file)).isDirectory()?path.join(file,'index.html'):file;res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(await readFile(target));}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/writing-sprout/`));
