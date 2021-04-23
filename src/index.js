const http = require('http')

const req = http.get('http://www.baidu.com')
req.on('response', resp => {
  console.log('resp:', resp)
})

req.end()