const Crawler = require('crawler')
const {setCookies, getCookies} = require('./utils/cookie')
// const encrypt = require('./utils/encrypt')

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback: (error, res, done) => {
      if (error) {
          console.log(error)
      } else {
        let uri = res.request.uri
        switch (res.statusCode) {
          case 404:
            console.log('request failed 404：', uri.href)
            break
          default:
            const $ = res.$

            if (!$){
              done()
              return
            } 
            var links = $('a')
            Object.values(links).forEach(link => {
              let href = (link.attribs && link.attribs.href) || ''
              if (!/^javascript:/.test(href) && href) {
                !(new RegExp('^' + uri.protocol).test(href)) && (href = uri.protocol + '://' + uri.host + href)
                c.queue(href)
              }
            })
            done()
            break
        }
      } 
  }
})

// return_url=https%3A%2F%2Fwww.jisilu.cn%2F&user_name=f6252842ba86e3c46219ced23232e108&password=d03f73fcbb855273d66202a9028e2a97&net_auto_login=1&_post_type=ajax&aes=1
c.direct({
  uri: 'https://www.jisilu.cn/account/ajax/login_process/',
  method: 'post',
  form: {
    return_url: 'https://www.jisilu.cn/',
    // user_name: encrypt('liuqi0702', 'A397151C04723421F'),
    user_name: 'f6252842ba86e3c46219ced23232e108',
    // password: encrypt('Liuqi070241/', 'A397151C04723421F'),
    password: 'd03f73fcbb855273d66202a9028e2a97',
    net_auto_login: 1,
    _post_type: 'ajax',
    aes: 1
  },
  callback (error, res) {
    if (error) {
      return 
    }
    try {
      let body = JSON.parse(res.body)
      switch (body.errno) {
        case -1:
          console.error(body.err || '登录错误！')
          // c.queue('https://www.jisilu.cn/account/agreement/')
          break
        default: 
          setCookies(res.headers['set-cookie'])
          setTimeout(() => {
            c.queue({
              uri: 'https://www.jisilu.cn/data/cbnew/cb_list/?___jsl=LST___t=' + Date.now(),
              headers: {
                Cookie: getCookies()
              },
              form: {
                fprice: '',
                tprice: '',
                curr_iss_amt: '',
                volume: '',
                svolume: '',
                premium_rt: '',
                rating_cd: '',
                is_search: 'R',
                market_cd: ['shmb', 'shkc', 'szmb', 'szcy'],
                btype: '',
                listed: 'Y',
                qflag: 'N',
                sw_cd: '',
                bond_ids: '',
                rp: 50,
                page: 1
              }
            })
          }, 10)
          // c.queue('https://www.jisilu.cn/account/agreement/')
      }
    } catch (error) {
      console.log('eror:', error)
    }  
  }
})
