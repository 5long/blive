var Conn = require('./conn')
  , relay = require('./relay')
  , inherits = require("util").inherits
  , EventEmitter = require("events")

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

Chat.create = function(channelID) {
  var chat = new Chat(channelID)
  return chat.connect()
}

module.exports = Chat

function main() {
  Chat.create(process.argv[2] || 5446)
    .on("comment", function(c) {
      console.log("%s : %s", c.nick, c.message)
    }).on("unknown", function(m) {
      console.log("unknown message: %s", m)
    }).on("onlineNumber", function(n) {
      console.log("# Online: %d", n)
    })
}

if (require.main === module) {
  main()
}
