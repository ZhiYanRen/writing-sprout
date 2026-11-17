import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:4186/writing-sprout/';
await mkdir('work/qa',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const reports=[];
try{
 for(const [width,height] of [[1440,1000],[1194,834],[834,1194],[768,1024],[390,844],[844,390]]){
  const context=await browser.newContext({viewport:{width,height},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);await page.getByRole('heading',{name:'今天，让文字发芽。'}).waitFor({timeout:5000});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));
  await page.screenshot({path:`work/qa/home-${width}.png`,fullPage:true});
  await page.locator('a[href="#pictures"]').first().click();await page.locator('h1').filter({hasText:'看图写话'}).waitFor();await page.locator('a[href="#write/park"]').click();
  await page.locator('#draft-title').fill('我的公园故事');await page.locator('#draft-text').fill('春天来了，我和妹妹在公园里放风筝。风筝飞得很高，我们开心地笑了。');
  await page.reload();assert.match(await page.locator('#draft-text').inputValue(),/妹妹/);
  await page.getByRole('button',{name:'看看参考'}).click();assert(await page.locator('#guide-content').getByText(/星期天/).isVisible());
  await page.getByRole('button',{name:'搭个架子'}).click();
  await page.locator('#complete').click();assert(await page.locator('#editor-error').isVisible());
  for(const c of await page.locator('.self-check input').all())await c.check();
  await page.locator('#complete').click();assert.match(await page.locator('#save-status').innerText(),/完成/);
  await page.screenshot({path:`work/qa/editor-${width}.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('a[href="#works"]').first().click();await page.getByRole('link',{name:/我的公园故事/}).waitFor();
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'备份全部作品'}).click();assert.match((await download).suggestedFilename(),/\.json$/);
  await page.locator('#work-search').fill('不存在的标题');assert(await page.getByText('还没有找到这篇作品').isVisible());
  await page.getByRole('button',{name:'清除搜索'}).click();
  await page.getByRole('button',{name:'删除我的公园故事'}).click();assert(await page.locator('dialog').isVisible());assert.equal(await page.evaluate(()=>document.activeElement.id),'dialog-cancel');await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').isVisible(),false);
  await page.getByRole('button',{name:'删除我的公园故事'}).click();await page.locator('#dialog-confirm').click();assert(await page.getByText('第一篇作品，从一句话开始').isVisible());
  await page.goBack();await page.goForward();
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('a[href="#home"]').first().click();await page.getByRole('heading',{name:'今天，让文字发芽。'}).waitFor();assert.equal(await page.locator('.page').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement));
  assert.deepEqual(errors,[]);reports.push({width,height,flows:'navigation, autosave/reload, guide, self-check/completion, backup, search, delete dialog, history, reduced motion, images, overflow'});await context.close();
 }
 const c=await browser.newContext(),p=await c.newPage();await p.goto(base+'#write/park');await p.locator('#draft-text').fill('这是第一份作品。');
 const other=await c.newPage();await other.goto(base+'#write/rain');await other.locator('#draft-text').fill('这是另一个窗口的作品。');
 await p.locator('#draft-text').fill('这里有尚未合并的文字。');assert(await p.locator('#storage-notice').isVisible());assert.match(await p.locator('#storage-notice').innerText(),/窗口/);
 const json={schema:1,entries:[{id:'seed',title:'小苗',text:'小苗长高了。',checks:[false,false,false],completed:false,updatedAt:new Date().toISOString()}]};
 await other.locator('a[href="#works"]').first().click();await other.locator('#import-file').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(json))});await other.getByRole('link',{name:/小苗/}).waitFor();
 await other.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{broken')});assert(await other.locator('#import-error').isVisible());assert(await other.getByRole('link',{name:/小苗/}).isVisible());await c.close();
 const denied=await browser.newContext();await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));const dp=await denied.newPage();await dp.goto(base+'#write/park');await dp.locator('#draft-text').fill('存储失败时也要保留文字。');assert(await dp.locator('#storage-notice').isVisible());assert.match(await dp.locator('#save-status').innerText(),/暂存/);const d=dp.waitForEvent('download');await dp.locator('#export-text').click();assert.match((await d).suggestedFilename(),/\.txt/);await denied.close();
 if(!process.env.TEST_URL){
  const offline=await browser.newContext(),op=await offline.newPage();await op.goto(base);await op.evaluate(()=>navigator.serviceWorker.ready);await op.waitForFunction(()=>navigator.serviceWorker.controller);await offline.setOffline(true);await op.reload();await op.locator('a[href="#pictures"]').first().click();await op.locator('h1').filter({hasText:'看图写话'}).waitFor();await op.locator('a[href="#write/park"]').click();await op.locator('#draft-text').waitFor();await offline.close();
 }
 await writeFile('work/qa/report.json',JSON.stringify({physicalDevice:false,browser:'Chrome desktop with touch emulation',reports,failures:['invalid import','storage unavailable','multi-tab conflict'],offline:!process.env.TEST_URL},null,2));console.log(`PASS ${reports.length} viewports and data/recovery flows`);
}finally{await browser.close();}
