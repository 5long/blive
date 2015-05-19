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
    number: buf.readUIntBE(2, 4)
  }]
}

const ignoreCommands = new Set(['PREPARING', 'LIVE'])

function parseComment(buf) {
  var pktLength = buf.readUIntBE(2, 2)

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
  }].concat(parse(remainingBuf))
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

// Circular recursion here. Just ignore warning from JSHint
// jshint -W003
function parse(buf) {
// jshint +W003
  if (!buf.length) {
    return []
  }
  
  var typeFlag = buf.readUIntBE(0, 2)

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
  var buf = new Buffer([
    1, 1, 0, 0xc,
    null, null, null, null,
    0, 0, 0, 0])
  buf.writeUIntBE(channelID, 4, 4)
  return buf
}

function composeHeartbeat() {
  return new Buffer([1, 2, 0, 4])
}

module.exports = {
  parse: parse,
  composeJoinChannel: composeJoinChannel,
  composeHeartbeat: composeHeartbeat,
}
