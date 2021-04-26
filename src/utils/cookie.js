const Cookies = {}

function parseCookie (cookie) {
  let nameValue = cookie.substr(0, cookie.indexOf(";"))
  let eqIndex = nameValue.indexOf('=')
  let name = nameValue.substr(0, eqIndex)
  let value = nameValue.substr(eqIndex + 1)
  return {
    [name]: value
  }
}

// item.substr(0, item.indexOf(";")
function parseCookies (cookies) {
  return cookies.map(item => parseCookie(item))
}

function setCookies (cookies) {
  Object.assign(Cookies, parseCookies(cookies))
}

function getCookies (cookies) {
  return Object.keys(cookies).map(item => item + '=' + cookies[item]).join(';')
}

module.exports = {
  parseCookie,
  parseCookies,
  setCookies,
  getCookies,
  Cookies
}
