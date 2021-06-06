const puppeteer     = require('puppeteer-extra')
    , pluginProxy   = require('puppeteer-extra-plugin-proxy')


;(async () => {
  puppeteer.use(
    pluginProxy({
      address: '127.0.0.1',
      port: '8888'
    })
  )

  const browser = await puppeteer.launch({ headless: false })

  const page = await browser.newPage()

  await page.goto(`https://api.ipify.org/`)


})()
