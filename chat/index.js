var Conn = require('./conn')
  , relay = require('../util/relay')
  , inherits = require("util").inherits
  , EventEmitter = require("events")
  , fetchHostID = require("./scraper").fetchHostID

function Chat(channelID) {
  EventEmitter.call(this)
  this.id = channelID
}
inherits(Chat, EventEmitter)

Chat.prototype.connect = function() {
  this.onlineNumber = 0
  this.conn = new Conn(this.id).connect()
  this.handleEvents()
  return this
}

Chat.prototype.handleEvents = function() {
  relay(this.conn, this, ["comment", "unknown"])
  this.conn.on("onlineNumber", this.handleOnlineNumber.bind(this))
}

Chat.prototype.handleOnlineNumber = function(m) {
  if (this.onlineNumber === m.number) {
    return
  }

  this.onlineNumber = m.number
  this.emit("onlineNumber", this.onlineNumber)
}

Chat.prototype.getHostID = function(cb) {
  if (this.hostID) return setImmediate(cb, null, this.hostID)

  fetchHostID(this.id, function(e, hostID) {
    cb(null, this.hostID = hostID)
  }.bind(this))
}

Chat.create = function(channelID) {
  var chat = new Chat(channelID)
  return chat.connect()
}

module.exports = Chat

function main() {
  Chat.create(process.argv[2] || 5446)
    .on("comment", function(c) {
      console.log("%s : %s", c.nick, c.text)
    }).on("unknown", function(m) {
      console.log("unknown message: %j", m)
    }).on("onlineNumber", function(n) {
      console.log("# Online: %d", n)
    }).on("userBlocked", function(b) {
      console.log("User %s[%s] is blocked by admin",
                 b.nick, b.uid)
    })
}

if (require.main === module) {
  main()
}
