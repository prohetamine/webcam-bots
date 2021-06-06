const puppeteer     = require('puppeteer-extra')
    , pluginProxy   = require('puppeteer-extra-plugin-proxy')

;(async ({ username, count = 30, proxy }) => {
  if (proxy) {
    const [address, port] = proxy.split(':')

    puppeteer.use(
      pluginProxy({ address, port })
    )
  }

  try {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    await page.setRequestInterception(true)

    page.on('request', request => {
      if (request.resourceType() === 'document' || !!request.url().match(username)) {
        request.continue()
      } else {
        request.abort()
      }
    })

    await page.goto(`https://chaturbate.com/${username}`)

    await page.evaluate(`
      const delay = ms => new Promise(res => setTimeout(res, ms))

      ;(async () => {
        for (let i = 0; i < ${count}; i++) {
          const body = await fetch(\`https://chaturbate.com/${username}\`).then(response => response.text())

          const user = JSON.parse(body.match(/window.initialRoomDossier = "[^;]+/)[0].slice(29).slice(0, -1).replace(/\\\\u0022/ig, '"').replace(/\\\\u005C/ig, '\\\\'))

          const ws = new WebSocket('wss'+user.wschat_host.slice(5)+'/'+parseInt(Math.random()*800)+'/'+Array(8).fill(1).map(() => String.fromCharCode(parseInt(Math.random()*20)+102)).join('')+'/websocket')

          ws.onmessage = response => {
            if (response.data === 'o') {
              ws.send(
                JSON.stringify([
                  JSON.stringify({
                    method: 'connect',
                    data: {
                      password: user.chat_password,
                      room: user.broadcaster_username,
                      room_password: user.room_pass,
                      user: user.chat_username
                    }
                  })
                ])
              )
            }

            if (response.data === 'h') {
              ws.send(
                JSON.stringify([
                  JSON.stringify({
                    method: 'updateRoomCount',
                    data: {
                      model_name: user.broadcaster_username,
                      private_room: false
                    }
                  })
                ])
              )
            }

            if (response.data[0] === 'a') {
              const json = JSON.parse(JSON.parse(response.data.slice(1))[0])

              if (json.method === 'onAuthResponse') {
                ws.send(
                  JSON.stringify([
                    JSON.stringify({
                      method: 'joinRoom',
                      data: {
                        room: user.broadcaster_username
                      }
                    })
                  ])
                )
              }
            }
          }
          await delay(500)
        }
      })()
    `)
  } catch (e) {
    process.exit(0)
  }
})({
  username: process.argv[2],
  count: process.argv[3],
  proxy: process.argv[4]
})

//  Hello up your users count ?)
