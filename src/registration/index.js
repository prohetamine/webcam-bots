const { spawn: _spawn }   = require('child_process')
const fs                  = require('fs')

// yarn reg 10 3

const proxys = fs.readFileSync(__dirname + '/../../other/proxy.txt', { encoding: 'utf8' }).match(/.+/g)

const spawn = path => new Promise(res => {
  console.log(path)
  const [process, ...args] = path.split(' ')
  _spawn(process, args).on('close', res)
})

;(async ({ count:_count = 5, repeat: _repeat = 3 }) => {
  console.log(_count+' x '+_repeat+' = '+(_count*_repeat)+'\n')

  for (let i = 0; i < _count;) {
    await Promise.all(
      Array(parseInt(_repeat)).fill(1).map(e => {
        return spawn(`node ${__dirname}/browser.js`)
      })
    )
  }
})({
  count: process.argv[2],
  repeat: process.argv[3]
})
