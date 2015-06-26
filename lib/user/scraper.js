var request = require("request")
  , html = require("whacko")
  , _ = require("lodash")
  , inherits = require("util").inherits

const DEFAULT_AVATAR = 'http://static.hdslb.com/images/member/noface.gif'

function ScrapeError() {}
inherits(ScrapeError, Error)


function parse($) {
  var elements = {
    avatar: $('.facebox img'),
    nick: $('.uname'),
    videosListLink: $('#num_video'),
  }

  _.values(elements).forEach(function(e) {
    if (!e.length) {
      throw new ScrapeError("Page doesn't have element " + e.selector)
    }
  })

  return {
    avatar: elements.avatar.attr('src'),
    nick: elements.nick.text(),
    id: elements.videosListLink.attr('href').match(/\/(\d+)/)[1],
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
      try {
        cb(null, normalize(parse(html.load(body))))
      } catch (e) {
        cb(e)
      }
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
