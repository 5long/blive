var request = require("request")
  , html = require("whacko")

const DEFAULT_AVATAR = 'http://static.hdslb.com/images/member/noface.gif'

function parse($) {
  return {
    avatar: $('.facebox img').attr('src'),
    nick: $('.uname').text(),
    id: $('#num_video').attr('href').match(/\/(\d+)/)[1],
  }
}

function normalize(user) {
  if (user.avatar.endsWith('templets/images/1.jpg')) {
    user.avatar = DEFAULT_AVATAR
  }
  return user
}

function fetch(userID, cb) {
  request({
    url: 'http://space.bilibili.com/' + userID,
    gzip: true,
  }, function(e, res, body) {
    if (e) return cb(e)
    cb(null, normalize(parse(html.load(body))))
  })
}

module.exports = fetch

function main(userID) {
  fetch(userID, function(e, user) {
    console.log(user)
  })
}

if (require.main === module) {
  main(process.argv[2] || 451142)
}
