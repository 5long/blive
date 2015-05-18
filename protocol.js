var decode = require("ent/decode")

const TYPES = {
  '1': 'onlineNumber',
  '4': 'comment'
}

function parseOnlineNumber(buf) {
  if (buf.length !== 6) {
    console.log("Can't easily handle number buffer: ", buf)
    return
  }

  return [{
    number: buf.readIntBE(2, 4)
  }]
}

const ignoreCommands = new Set(['PREPARING', 'LIVE'])

function parseComment(buf) {
  var pktLength = buf.readIntBE(2, 2)

  var actualBuf = buf.slice(4, pktLength)

  var payload = JSON.parse(actualBuf.toString("utf8"))

  var remainingBuf = buf.slice(pktLength)

  // TODO: parse this as well
  if (remainingBuf.length) {
    console.log("More message buf: %s", remainingBuf)
  }

  if (ignoreCommands.has(payload.cmd)) {
    return []
  }

  return [{
    nick: payload.info[2][1],
    message: decode(payload.info[1])
  }]
}

function parseUnknown(buf) {
  return [{
    buffer: buf
  }]
}

var parsers = {
  onlineNumber: parseOnlineNumber,
  comment: parseComment,
  unknown: parseUnknown
}

function parse(buf) {
  var typeFlag = buf.readIntBE(0, 2)

  var type = TYPES[typeFlag] || 'unknown'

  var messages = parsers[type](buf)

  messages.forEach(function(m) {
    if (!m.type) {
      m.type = type
    }
  })

  return messages
}

function composeJoinChannel(channelID) {
  var buf = new Buffer(12)
  buf.write("\x01\x01\x00\x0C", 0)
  buf.writeInt32BE(channelID, 4)
  buf.write("\x00\x00\x00\x00", 8)
  return buf
}

function composeHeartbeat() {
  return new Buffer("\x01\x02\x00\x04")
}

module.exports = {
  parse: parse,
  composeJoinChannel: composeJoinChannel,
  composeHeartbeat: composeHeartbeat,
}
