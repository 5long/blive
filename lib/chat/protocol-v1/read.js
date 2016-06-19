const _ = require('lodash')
  , C = require('./consts')
  , normalizeUserCommand = require('./user_command')

function readPacketLength(buf) {
  const len = buf.readInt32BE(0)
  console.assert(len >= C.headerLength, 'minium packet length failed', len)

  return len
}

function readMessageType(buf) {
  // It is said that the minus-one operation
  // "complies to the reverse engineered code"
  // See: https://github.com/copyliu/bililive_dm/commit/6090ed4e25b07c125853932d8760a29dd0bfefda#diff-695b3e45d4ccdfc0074ff6ac0eef8711R128
  return buf.readInt32BE(8) - 1
}

const messages = {
  2(payload) {
    return {
      type: 'onlineNumber',
      number: payload.readUInt32BE(),
    }
  },
  4(payload) {
    try {
      return normalizeUserCommand(JSON.parse(payload))
    } catch (e) {
        // Meh. Wait until implement it as TransformStream
      return {
        payload, type: 'incomplete',
      }
    }
  },
}

function processUnknownMsg(payload, buf) {
  return {
    type: 'unknown',
  }
}

function parseSingleMsg(buf) {
  const typeId = readMessageType(buf)
    , msgProcessor = messages[typeId] || processUnknownMsg

  const msg = msgProcessor(
    buf.slice(C.headerLength), buf)
  return _.merge(msg, {
    buf, typeId,
  })
}

const Transform = require('stream').Transform
  , inherits = require('util').inherits

function Decoder(options) {
  if (!(this instanceof Decoder)) {
    return new Decoder(options)
  }

  Transform.apply(this, arguments)

  this.remaining = new Buffer(0)
}
inherits(Decoder, Transform)

Decoder.prototype._transform = function transform(buf, encoding, done) {
  this.acceptBuffer(buf)
  this.startParsing(done)
}

Decoder.prototype.acceptBuffer = function acceptBuffer(buf) {
  this.remaining = Buffer.concat([this.remaining, buf])
}

Decoder.prototype.startParsing = function startParsing(done) {
  if (this.hasNextPacket()) {
    this.consumeOnePacket()
    this.continueParsing(done)
  } else {
    done()
  }
}

Decoder.prototype.continueParsing = function continueParsing(done) {
  setImmediate(
    this.startParsing.bind(this, done))
}

Decoder.prototype.consumeOnePacket = function consumeOnePacket() {
  const buf = this.remaining
    , len = readPacketLength(buf)

  const msg = parseSingleMsg(buf.slice(0, len))
  this.remaining = buf.slice(len)
  this.emit('packet', msg)
}

Decoder.prototype.hasNextPacket = function hasNextPacket() {
  const bufLength = this.remaining.length
  if (!bufLength) return false

  return readPacketLength(this.remaining) < bufLength
}

module.exports = {
  Decoder,
}
