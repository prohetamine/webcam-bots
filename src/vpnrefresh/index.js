const { spawn: _spawn }   = require('child_process')
const rp                  = require('request-promise')
const sleep               = require('sleep-promise')

const killvpn = () => new Promise(res => {
  const processes = _spawn('ps', ['ax'])

  let outdata = ''
  processes.stdout.on('data', (data) => {
    outdata += data

    try {
      if (outdata.match(/-bash/)) {
        _spawn('sudo', ['kill', '-9', outdata.match(/.+ovpn/)[0].match(/[^\s]+/)[0]]).on('close', res)
      }
    } catch (e) {
      res()
    }
  });
})

const vpnrefresh = () => new Promise(async res => {
  const vpn_path = 'sudo /Applications/NordVPN.app/Contents/MacOS/NordVPN'

  await killvpn()

  const [process, ...args] = vpn_path.split(' ')
  const vpn = _spawn(process, args)

  setTimeout(() => {
    vpn.stdin.end()
    res()
  }, 20000)

})

;(async () => {
  const oldIps = [await rp('http://api.ipify.org/')]

  for (;;) {
    for (;;) {
      try {
        const oldIp = await rp('http://api.ipify.org/')

        await vpnrefresh()

        const newIp = await rp('http://api.ipify.org/')

        if (!oldIps.includes(newIp)) {
          console.log(oldIp + ' => ' + newIp)
          oldIps.push(newIp)
          break
        }
      } catch (e) {}
    }

    await sleep(120000)
  }
})()
