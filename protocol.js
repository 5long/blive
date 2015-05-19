// jshint -W003
var decode = require("ent/decode")

var ONLINE_NUMBER_PKT_LENGTH = 6
function parseOnlineNumber(buf) {
  return [{
    type: 'onlineNumber',
    number: buf.readUIntBE(2, 4)
  }].concat(parse(buf.slice(ONLINE_NUMBER_PKT_LENGTH)))
}

var IGNORE_COMMANDS = new Set(['PREPARING', 'LIVE'])

function parseComment(buf) {
  var pktLength = buf.readUIntBE(2, 2)

  var actualBuf = buf.slice(4, pktLength)

  var payload = JSON.parse(actualBuf.toString("utf8"))

  var remainingBuf = buf.slice(pktLength)

  if (IGNORE_COMMANDS.has(payload.cmd)) {
    return parse(remainingBuf)
  }

  if (payload.cmd !== 'DANMU_MSG') {
    return parseUnknown(buf)
  }

  var colorBuf = new Buffer(3)
  colorBuf.writeUIntBE(payload.info[0][3], 0, colorBuf.length)

  return [{
    type: 'comment',
    uid: payload.info[2][0],
    nick: payload.info[2][1],
    text: decode(payload.info[1]),
    color: {
      red: colorBuf[0],
      green: colorBuf[1],
      blue: colorBuf[2],
    }
  }].concat(parse(remainingBuf))
}

function parseUnknown(buf) {
  return [{
    type: 'unknown',
    buffer: buf
  }]
}

var parsers = {
  '1': parseOnlineNumber,
  '4': parseComment,
}

function parse(buf) {
  if (!buf.length) {
    return []
  }

  var typeFlag = buf.readUIntBE(0, 2)

  return (parsers[typeFlag] || parseUnknown)(buf)
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
