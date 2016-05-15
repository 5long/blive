var PROTOCOL_VERSION = 1
  , PACKET_MAGIC = 16
  , PACKET_MAGIC_PARAM = 1
  , PACKET_HEADER_LENGTH = 16
  , ACTIONS = {
      heartbeat: 2,
      joinChannel: 7
    }


function composePacket(action, payload) {
  payload = payload || ""

  var packetLength = figurePacketLength(payload)

  var buf = new Buffer(packetLength)

  writePacketLength(buf, packetLength)
  writeConsts(buf)
  writeAction(buf, action)
  writePayload(buf, payload)

  return buf
}

function figurePacketLength(payload) {
  return Buffer.byteLength(payload) + PACKET_HEADER_LENGTH
}

function writePacketLength(buf, packetLength) {
  buf.writeInt32BE(packetLength, 0)
}

function writeConsts(buf) {
  buf.writeInt16BE(PACKET_MAGIC, 4)
  buf.writeInt16BE(PROTOCOL_VERSION, 6)
  buf.writeInt32BE(PACKET_MAGIC_PARAM, 12)
}

function writeAction(buf, action) {
  buf.writeInt32BE(action, 8)
}

function writePayload(buf, payload) {
  buf.write(payload, PACKET_HEADER_LENGTH)
}

function composeHeartbeat() {
  return composePacket(ACTIONS.heartbeat)
}

function generateRandomUid() {
  return 1e14 + Math.ceil(2e14 * Math.random())
}

function composeJoinChannel(channelID, uidFunctor) {
  var uid = (uidFunctor || generateRandomUid)()
  return composePacket(
    ACTIONS.joinChannel, JSON.stringify({
      uid: uid, roomid: channelID
    }))
}

module.exports = {
  composeJoinChannel,
  composeHeartbeat,
  parse: require("./protocol-v1/read").parse
}
