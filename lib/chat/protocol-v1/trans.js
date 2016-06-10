var _ = require("lodash")
  , C = require("./consts")

var normalizeUserCommand = require('./user_command')

function readPacketLength(buf) {
  var len = buf.readInt32BE(0)
  console.assert(len >= C.headerLength, "minium packet length failed", len)

  return len
}

function readProtocolVersion(buf) {
  return buf.readInt16BE(6)
}

function readMessageType(buf) {
  // It is said that the minus-one operation
  // "complies to the reverse engineered code"
  // See: https://github.com/copyliu/bililive_dm/commit/6090ed4e25b07c125853932d8760a29dd0bfefda#diff-695b3e45d4ccdfc0074ff6ac0eef8711R128
  return buf.readInt32BE(8) - 1
}

var messages = {
  2: function(payload) {
    return {
      type: 'onlineNumber',
      number: payload.readUInt32BE(),
    }
  },
  4: function(payload) {
    try {
      var msg = JSON.parse(payload)
    } catch (e) {
        // Meh. Wait until implement it as TransformStream
        return {type: 'incomplete', payload}
    }
    return normalizeUserCommand(msg)
  }
}

function parse(buf) {
  if (!(buf && buf.length)) return []

  var len = readPacketLength(buf)
    , firstMsg = parseSingleMsg(buf.slice(0, len))

  if (len > buf.length) {
    console.log("Incomplete buffer: ", buf)
    return []
  }

  return [firstMsg].concat(parse(buf.slice(len)))
}

function parseSingleMsg(buf) {
  var typeId = readMessageType(buf)
    , msgProcessor = messages[typeId] || processUnknownMsg

  var msg = msgProcessor(
    buf.slice(C.headerLength), buf)
  return _.merge(msg, {
    buf, typeId,
  })
}

function processUnknownMsg(payload, buf) {
  return {
    type: 'unknown',
  }
}

var Transform = require("stream").Transform
  , inherits = require("util").inherits
inherits(Decoder, Transform)

function Decoder(options) {
  if (!(this instanceof Decoder)) {
    return new Decoder(options)
  }

  Transform.apply(this, arguments)

  this.remaining = new Buffer(0)
}

Decoder.prototype._transform = function(buf, encoding, done) {
  this.acceptBuffer(buf)
  this.startParsing(done)
}

Decoder.prototype.acceptBuffer = function(buf) {
  this.remaining = Buffer.concat([this.remaining, buf])
}

Decoder.prototype.startParsing = function(done) {
  if (this.hasNextPacket()) {
    this.consumeOnePacket()
    this.startParsing(done)
  } else {
    done()
  }
}

Decoder.prototype.consumeOnePacket = function() {
  var buf = this.remaining
    , len = readPacketLength(buf)
    , msg

  msg = parseSingleMsg(buf.slice(0, len))
  this.remaining = buf.slice(len)
  this.emit("packet", msg)
}

Decoder.prototype.hasNextPacket = function() {
  var bufLength = this.remaining.length
  if (!bufLength) return

  return readPacketLength(this.remaining) < bufLength
}

module.exports = {
  Decoder: Decoder
}
