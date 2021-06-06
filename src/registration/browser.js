const puppeteer           = require('puppeteer-extra')
    , pluginProxy         = require('puppeteer-extra-plugin-proxy')
    , createUser          = require('./../other/create-user.js')
    , sleep               = require('sleep-promise')
    , { getInbox }        = require('./../../custom_modules/temp-mail')
    , fs                  = require('fs')
    , rp                  = require('request-promise')
    , RecaptchaPlugin     = require('./../../custom_modules/puppeteer-extra-plugin-recaptcha')

;(async ({ proxy }) => {
  if (proxy) {
    const [address, port] = proxy.split(':')

    puppeteer.use(
      pluginProxy({ address, port })
    )
  }

  puppeteer.use(
    RecaptchaPlugin({
      provider: {
        id: '2captcha',
        token: 'fbe57490fdf100cfca8fb5ab5138f3b7'
      },
      visualFeedback: true
    })
  )

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.setRequestInterception(true)

  page.on('request', request => {
    if (
      request.resourceType() === 'document' ||
      request.url().match('https://www.google.com/recaptcha') ||
      request.resourceType() === 'script'
    ) {
      request.continue()
    } else {
      request.abort()
    }
  })

  await page.goto(`https://chaturbate.com/accounts/register`)

  const user = await createUser()

  validate:for (;;) {
    try {
      const {
        username,
        password,
        email,
        month,
        day,
        year,
        gender
      } = user

      await page.evaluate(`
        document.getElementById('husername').value = ''
        document.getElementById('hpassword').value = ''
        document.getElementById('id_email').value = ''
        document.getElementById('id_gender').value = ''
        document.getElementById('id_gender').value = ''

        document.getElementById('id_terms').checked = false
        document.getElementById('id_privacy_policy').checked = false
      `)


      await page.type('#husername', username, { dalay: 50 })
      await page.type('#hpassword', password, { dalay: 50 })
      await page.type('#id_email', email, { dalay: 50 })
      await page.type('#id_birthday_month', month, { dalay: 50 })
      await page.type('#id_birthday_day', day, { dalay: 50 })
      await page.type('#id_birthday_year', year, { dalay: 50 })
      await page.type('#id_gender', gender, { dalay: 50 })

      await page.evaluate(`
        document.getElementById('id_terms').click()
        document.getElementById('id_privacy_policy').click()
      `)


      let i = 0

      check:for (;;) {
        i++
        if (i === 10) {
          break check
        }

        await sleep(500)

        const no_error = await page.evaluate(
            () => !!![...document.querySelectorAll('.formvalidate_error')].map(err => err.style.display).find(e => e == "table-row")
        )

        if (no_error) {
          break validate
        }

      }
    } catch (e) {}
  }

  await page.solveRecaptchas()

  await Promise.all([
    page.waitForNavigation(),
    page.click(`#formsubmit`)
  ])

  try {
    await page.waitForSelector('.tokencountlink', {
      timeout: 30000
    })

    const cookies = await page.cookies();
    fs.writeFileSync(`${__dirname}/../../data/test-accounts/${user.email}.json`, JSON.stringify({
      cookies,
      user
    }));

    const mail = await getInbox(user.email)

    let isVerify = false

    for (let i = 0; i < mail.length;i++) {
      try {
        await rp(mail[i].mail_text_only.match(/https[^"]+/)[0])
        isVerify = true
      } catch (e) {}
    }

    console.log(isVerify ? 'good register' : 'bad verify')
    process.exit(0)
  } catch (e) {
    console.log(e, 'error register')
    process.exit(0)
  }
})({
  proxy: process.argv[2]
})
