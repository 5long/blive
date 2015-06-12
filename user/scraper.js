var request = require("request")
  , html = require("whacko")

function parse($) {
  return {
    avatar: $('.facebox img').attr('src'),
    nick: $('.uname').text(),
    id: $('#num_video').attr('href').match(/\/(\d+)/)[1],
  }
}

function fetch(userID, cb) {
  request({
    url: 'http://space.bilibili.com/' + userID,
    gzip: true,
  }, function(e, res, body) {
    if (e) return cb(e)
    cb(null, parse(html.load(body)))
  })
}

module.exports = fetch
fetch.fetch = fetch

function main(userID) {
  fetch(userID, function(e, user) {
    console.log(user)
  })
}

if (require.main === module) {
  main(process.argv[2] || 451142)
}
