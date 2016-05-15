var C = require("./consts")

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
  return Buffer.byteLength(payload) + C.headerLength
}

function writePacketLength(buf, packetLength) {
  buf.writeInt32BE(packetLength, 0)
}

function writeConsts(buf) {
  buf.writeInt16BE(C.magic, 4)
  buf.writeInt16BE(C.version, 6)
  buf.writeInt32BE(C.magicParam, 12)
}

function writeAction(buf, action) {
  buf.writeInt32BE(action, 8)
}

function writePayload(buf, payload) {
  buf.write(payload, C.headerLength)
}

function composeHeartbeat() {
  return composePacket(C.actions.heartbeat)
}

function generateRandomUid() {
  return 1e14 + Math.ceil(2e14 * Math.random())
}

function composeJoinChannel(channelID, uidFunctor) {
  var uid = (uidFunctor || generateRandomUid)()
  return composePacket(
    C.actions.joinChannel, JSON.stringify({
      uid: Number(uid), roomid: Number(channelID)
    }))
}


module.exports = {
  composeJoinChannel,
  composeHeartbeat,
}
