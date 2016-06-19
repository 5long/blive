const request = require('request')
  , html = require('whacko')

function parseHostID($) {
  return $('.up-name a').attr('href').match(/\/(\d+)$/)[1]
}

function fetchHostID(channelID, cb) {
  request({
    url: `http://live.bilibili.com/${channelID}`,
    gzip: true,
  }, function(e, res, body) {
    if (e) return cb(e)

    const $ = html.load(body)
    cb(null, parseHostID($))
  })
}

module.exports = fetchHostID
fetchHostID.fetchHostID = fetchHostID

function main(channelID) {
  fetchHostID(channelID, function(e, hostID) {
    console.log(hostID)
  })
}

if (require.main === module) {
  main(process.argv[2])
}
