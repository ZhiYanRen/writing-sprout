// Render the maintained vector source; PNG outputs are tracked, not regenerated in CI.
import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {const svg=await readFile('public/assets/logo.svg','utf8');for(const size of [180,192,512]){const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});await page.setContent(`<style>html,body{margin:0;width:100%;height:100%;background:transparent}svg{width:100%;height:100%;display:block}</style>${svg}`);await page.screenshot({path:`public/assets/icon-${size}.png`,omitBackground:true});await page.close();}}finally{await browser.close();}
