var request = require("request")
  , html = require("whacko")
  , inherits = require("util").inherits

const DEFAULT_AVATAR = 'http://static.hdslb.com/images/member/noface.gif'

function ScrapeError(message) {
  Error.apply(this, arguments)
  this.message = message
}
inherits(ScrapeError, Error)


function findScriptWithData(scripts, $) {
  return scripts.filter(function(i, s) {
    return $(s).text().indexOf('_bili_space_info') !== -1
  })
}

function parseDataLine(line) {
  var userInfoJson = line.match(/eval\((.*)\)/)[1]
  return JSON.parse(userInfoJson)
}

function parseData(script) {
  var lines = script.split("\n")
    , lineWithUserInfo = lines.filter(function(line) {
        return line.indexOf('_bili_space_info') !== -1
      })[0]

  return parseDataLine(lineWithUserInfo)
}

function normalize(user) {
  return {
    id: user.mid,
    nick: user.name,
    avatar: user.face.endsWith('templets/images/1.jpg') ? DEFAULT_AVATAR : user.face,
  }
}

function parseV2($) {
  var scripts = $("script")
    , scriptWithData = findScriptWithData(scripts, $)
  return parseData(scriptWithData.text())
}

function fetch(userID, cb) {
  request({
    url: 'http://space.bilibili.com/' + userID + '/',
    gzip: true,
  }, function(e, res, body) {
    if (e) return cb(e)
      try {
        cb(null, normalize(parseV2(html.load(body))))
      } catch (e) {
        cb(e)
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
  main(process.argv[2] || 451142)
}
