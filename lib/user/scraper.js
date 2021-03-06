var request = require("request")
  , inherits = require("util").inherits

const DEFAULT_AVATAR = 'http://static.hdslb.com/images/member/noface.gif'

function ScrapeError(message) {
  Error.apply(this, arguments)
  this.message = message
}
inherits(ScrapeError, Error)


function normalize(datum) {
  var u = datum.data
  return {
    id: String(u.mid),
    nick: u.name,
    avatar: u.face.endsWith('templets/images/1.jpg') ? DEFAULT_AVATAR : u.face,
  }
}

function fetch(userID, cb) {
  request({
    method: 'POST',
    url: 'http://space.bilibili.com/ajax/member/GetInfo',
    form: { mid: userID, '_': Date.now() },
    headers: {
      'Referer': 'http://space.bilibili.com/',
    },
    gzip: true,
    json: true,
  }, function(e, res, datum) {
    if (e) return cb(e)

    try {
      cb(null, normalize(datum))
    } catch (err) {
      cb(err)
    }
  })
}

module.exports = fetch

function main(userID) {
  fetch(userID, function(e, user) {
    if (e) console.log(e.message)
    else console.log(user)
  })
}

if (require.main === module) {
  main(process.argv[2] || '451142')
}
