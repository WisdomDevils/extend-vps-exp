import puppeteer from 'puppeteer'
import { setTimeout } from 'node:timers/promises'
// 【新增】导入 puppeteer-extra 和 stealth 插件
import puppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// 【新增】使用 stealth 插件
puppeteerExtra.use(StealthPlugin())

const args = ['--no-sandbox', '--disable-setuid-sandbox']
if (process.env.PROXY_SERVER) {
    const proxy_url = new URL(process.env.PROXY_SERVER)
    proxy_url.username = ''
    proxy_url.password = ''
    args.push(`--proxy-server=${proxy_url}`.replace(/\/$/, ''))
}

// 【修改】使用 puppeteerExtra 替代 puppeteer
const browser = await puppeteerExtra.launch({
    defaultViewport: { width: 1080, height: 1024 },
    args,
})
const [page] = await browser.pages()
const userAgent = await browser.userAgent()
await page.setUserAgent(userAgent.replace('Headless', ''))
const recorder = await page.screencast({ path: 'recording.webm' })

// 【新增】Cloudflare 检测和处理函数
async function handleCloudflareIfPresent(page) {
    try {
        // 先等待一下，让 Cloudflare 完全加载
        await setTimeout(2000)
        
        const body = await page.evaluate(() => document.body.innerText)
        if (body.includes('Checking your browser') || 
            body.includes('Please wait') ||
            body.includes('Verifying you are human') ||
            body.includes('Cloudflare')) {
            
            console.log('检测到 Cloudflare 验证，等待转圈完成...')
            
            // 等待转圈结束，Cloudflare 验证框出现
            await page.waitForFunction(() => {
                const body = document.body.innerText
                return !body.includes('Checking your browser') && 
                       !body.includes('Please wait') &&
                       !body.includes('Verifying you are human')
            }, { timeout: 30000 })
            
            console.log('Cloudflare 转圈完成，等待验证框出现...')
            
            // 额外等待，确保验证框完全加载
            await setTimeout(5000)
            
            // 检查是否有 Cloudflare 验证框（checkbox）
            const hasCheckbox = await page.evaluate(() => {
                const iframe = document.querySelector('iframe[src*="cloudflare"]')
                return !!iframe
            })
            
            if (hasCheckbox) {
                console.log('检测到 Cloudflare 验证框，等待自动完成...')
                // 等待 Cloudflare 验证自动完成
                await setTimeout(10000)
            }
            
            console.log('Cloudflare 验证处理完成')
        }
    } catch (error) {
        console.log('Cloudflare 处理出错:', error.message)
    }
}

try {
    if (process.env.PROXY_SERVER) {
        const { username, password } = new URL(process.env.PROXY_SERVER)
        if (username && password) {
            await page.authenticate({ username, password })
        }
    }
    await page.goto('https://secure.xserver.ne.jp/xapanel/login/xvps/', { waitUntil: 'networkidle2' })
    await page.locator('#memberid').fill(process.env.EMAIL)
    await page.locator('#user_password').fill(process.env.PASSWORD)
    await page.locator('text=ログインする').click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    await page.locator('a[href^="/xapanel/xvps/server/detail?id="]').click()
    await page.locator('text=更新する').click()
    await page.locator('text=引き続き無料VPSの利用を継続する').click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    
    const body = await page.$eval('img[src^="data:"]', img => img.src)
    const code = await fetch('https://captcha-120546510085.asia-northeast1.run.app', { method: 'POST', body }).then(r => r.text())
    await page.locator('[placeholder="上の画像の数字を入力"]').fill(code)
    
    // 【新增】填入验证码后，处理 Cloudflare 验证
    await handleCloudflareIfPresent(page)
    
    await page.locator('text=無料VPSの利用を継続する').click()
} catch (e) {
    console.error(e)
} finally {
    await setTimeout(5000)
    await recorder.stop()
    await browser.close()
}import puppeteer from 'puppeteer'
import { setTimeout } from 'node:timers/promises'
// 【新增】导入 puppeteer-extra 和 stealth 插件
import puppeteerExtra from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// 【新增】使用 stealth 插件
puppeteerExtra.use(StealthPlugin())

const args = ['--no-sandbox', '--disable-setuid-sandbox']
if (process.env.PROXY_SERVER) {
    const proxy_url = new URL(process.env.PROXY_SERVER)
    proxy_url.username = ''
    proxy_url.password = ''
    args.push(`--proxy-server=${proxy_url}`.replace(/\/$/, ''))
}

// 【修改】使用 puppeteerExtra 替代 puppeteer
const browser = await puppeteerExtra.launch({
    defaultViewport: { width: 1080, height: 1024 },
    args,
})
const [page] = await browser.pages()
const userAgent = await browser.userAgent()
await page.setUserAgent(userAgent.replace('Headless', ''))
const recorder = await page.screencast({ path: 'recording.webm' })

// 【新增】Cloudflare 检测和处理函数
async function handleCloudflareIfPresent(page) {
    try {
        // 先等待一下，让 Cloudflare 完全加载
        await setTimeout(2000)
        
        const body = await page.evaluate(() => document.body.innerText)
        if (body.includes('Checking your browser') || 
            body.includes('Please wait') ||
            body.includes('Verifying you are human') ||
            body.includes('Cloudflare')) {
            
            console.log('检测到 Cloudflare 验证，等待转圈完成...')
            
            // 等待转圈结束，Cloudflare 验证框出现
            await page.waitForFunction(() => {
                const body = document.body.innerText
                return !body.includes('Checking your browser') && 
                       !body.includes('Please wait') &&
                       !body.includes('Verifying you are human')
            }, { timeout: 30000 })
            
            console.log('Cloudflare 转圈完成，等待验证框出现...')
            
            // 额外等待，确保验证框完全加载
            await setTimeout(5000)
            
            // 检查是否有 Cloudflare 验证框（checkbox）
            const hasCheckbox = await page.evaluate(() => {
                const iframe = document.querySelector('iframe[src*="cloudflare"]')
                return !!iframe
            })
            
            if (hasCheckbox) {
                console.log('检测到 Cloudflare 验证框，等待自动完成...')
                // 等待 Cloudflare 验证自动完成
                await setTimeout(10000)
            }
            
            console.log('Cloudflare 验证处理完成')
        }
    } catch (error) {
        console.log('Cloudflare 处理出错:', error.message)
    }
}

try {
    if (process.env.PROXY_SERVER) {
        const { username, password } = new URL(process.env.PROXY_SERVER)
        if (username && password) {
            await page.authenticate({ username, password })
        }
    }
    await page.goto('https://secure.xserver.ne.jp/xapanel/login/xvps/', { waitUntil: 'networkidle2' })
    await page.locator('#memberid').fill(process.env.EMAIL)
    await page.locator('#user_password').fill(process.env.PASSWORD)
    await page.locator('text=ログインする').click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    await page.locator('a[href^="/xapanel/xvps/server/detail?id="]').click()
    await page.locator('text=更新する').click()
    await page.locator('text=引き続き無料VPSの利用を継続する').click()
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    
    const body = await page.$eval('img[src^="data:"]', img => img.src)
    const code = await fetch('https://captcha-120546510085.asia-northeast1.run.app', { method: 'POST', body }).then(r => r.text())
    await page.locator('[placeholder="上の画像の数字を入力"]').fill(code)
    
    // 【新增】填入验证码后，处理 Cloudflare 验证
    await handleCloudflareIfPresent(page)
    
    await page.locator('text=無料VPSの利用を継続する').click()
} catch (e) {
    console.error(e)
} finally {
    await setTimeout(5000)
    await recorder.stop()
    await browser.close()
}
