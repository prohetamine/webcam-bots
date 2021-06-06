const { spawn: _spawn }   = require('child_process')
const fs                  = require('fs')

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
    } catch (e) {}
  }
}

;(async ({ username, count:_count = 5 }) => {

  const count = Math.ceil(_count/3)

  repeatSpawn(`node ${__dirname}/browser.js ${username} ${count}`)
  repeatSpawn(`node ${__dirname}/browser.js ${username} ${count}`)
  repeatSpawn(`node ${__dirname}/browser.js ${username} ${count}`)
})({
  username: process.argv[2],
  count: process.argv[3]
})
