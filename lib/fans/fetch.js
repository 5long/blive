const request = require('request')
  , inherits = require('util').inherits
  , parser = require('./parser')

function AppError(statusCode) {
  this.statusCode = statusCode
}
inherits(AppError, Error)

function fetchUserSpace(uid, page, cb) {
  return request({
    url: 'http://space.bilibili.com/ajax/friend/getFansList',
    qs: { page, mid: uid },
  }, function(e, res, body) {
    if (e) {
      return cb(e)
    }

    if (res.statusCode !== 200) {
      return cb(new AppError(res.statusCode))
    }

    return cb(null, body)
  })
}

function fetchFans(uid, page, cb) {
  fetchUserSpace(uid, page, function(e, body) {
    if (e) return cb(e)

    try {
      cb(null, parser.parseFans(body))
    } catch (err) {
      cb(err)
    }
  })
}

function main(uid, page) {
  fetchFans(uid, page, function(e, fans) {
    if (e) {
      return console.log(e.stack)
    }

    console.log(fans)
  })
}

if (require.main === module) {
  main(process.argv[2] || 451142, process.argv[3] || 1)
}

module.exports = fetchFans
fetchFans.fetchFans = fetchFans
