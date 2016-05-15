var net = require("net")
  , protocol = require("./protocol-v1")
  , EventEmitter = require("events")
  , inherits = require("util").inherits

var HOST = "livecmt-2.bilibili.com"
  , PORT = "788"

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
  this.sendHeartbeat()
}

Conn.prototype.setupHeartbeat = function() {
  this.hbInterval = setInterval(function() {
    this.sendHeartbeat()
  }.bind(this), 30000)
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

Conn.prototype.reconnect = function(e) {
  this.stopHeartbeat()
  this.connect()
}

Conn.prototype.stopHeartbeat = function() {
  clearInterval(this.hbInterval)
  this.hbInterval = null
}

module.exports = Conn
Conn.Conn = Conn
