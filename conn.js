var net = require("net")
  , protocol = require("./protocol")
  , EventEmitter = require("events")
  , inherits = require("util").inherits

var HOST = "livecmt.bilibili.com"
  , PORT = "88"

function Conn(channelID) {
  this.channelID = channelID
  this.socket = this.hbInterval = null
}
inherits(Conn, EventEmitter)

Conn.prototype.connect = function() {
  this.socket = net.connect(PORT, HOST)
  this.handleEvents()
  return this
}

Conn.prototype.handleEvents = function() {
  this.handleConnection()
  this.handleData()
  this.handleDisconnect()
}

Conn.prototype.handleConnection = function() {
  this.socket.on('connect', function() {
    this.joinChannel()
    this.setupHeartbeat()
  }.bind(this))
}

Conn.prototype.joinChannel = function() {
  this.socket.write(protocol.composeJoinChannel(this.channelID))
}

Conn.prototype.setupHeartbeat = function() {
  this.hbInterval = setInterval(function() {
    this.sendHeartbeat()
  }.bind(this), 55000)
}

Conn.prototype.sendHeartbeat = function() {
  this.socket.write(protocol.composeHeartbeat())
}

Conn.prototype.handleData = function() {
  this.socket.on("data", function(buf) {
    var messages = protocol.parse(buf)
    messages.forEach(function(m) {
      this.emit(m.type, m)
    }, this)
  }.bind(this))
}

Conn.prototype.handleDisconnect = function() {
  this.socket.on("error", this.reconnect.bind(this))
}

Conn.prototype.reconnect = function() {
  this.stopHeartbeat()
  this.connect()
}

Conn.prototype.stopHeartbeat = function() {
  clearInterval(this.hbInterval)
  this.hbInterval = null
}

module.exports = Conn
Conn.Conn = Conn

function newDumbConnection(channelID) {
  var conn = new Conn(channelID)
  conn.on("comment", function(c) {
    console.log("%s : %s", c.nick, c.message)
  }).on("unknown", function(m) {
    console.log("unknown message: %j", m)
  }).on("onlineNumber", function(m) {
    console.log("# Online: %d", m.number)
  })
  conn.connect()
}

if (module.id === '.') {
  newDumbConnection(process.argv[2] || 5446)
}
