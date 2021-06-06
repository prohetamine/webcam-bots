const { spawn: _spawn }   = require('child_process')
const fs                  = require('fs')
const sleep               = require('sleep-promise')

const proxys = fs.readFileSync(__dirname + '/../../other/proxy.txt', { encoding: 'utf8' }).match(/.+/g)

const spawn = path => new Promise(res => {
  console.log(path)
  const [process, ...args] = path.split(' ')
  _spawn(process, args).on('close', res)
})

const repeatSpawn = async path => {
  for (;;) {
    const proxy = proxys[parseInt(Math.random()*(proxys.length - 1))]
    try {
      await spawn(path+' ')
      await sleep(60000 * 30)
    } catch (e) {}
  }
}

;(async ({ username, count:_count = 5, browser = 3 }) => {

  const count = Math.ceil(_count/browser)

  for (let i = 0; i < browser; i++) {
    repeatSpawn(`node ${__dirname}/browser.js ${username} ${count}`)
  }

})({
  username: process.argv[2],
  count: process.argv[3],
  browser: process.argv[4]
})
