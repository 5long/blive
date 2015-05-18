var net = require("net")
  , protocol = require("./protocol")
  , events = require("events")
  , inherits = require("util").inherits

const host = "livecmt.bilibili.com"
const port = "88"

function Conn(channelID) {
  this.channelID = channelID
  this.socket = this.hbInterval = null
}
inherits(Conn, events.EventEmitter)

Conn.prototype.connect = function() {
  this.socket = net.connect(port, host)
  this.handleEvents(this.socket)
}

Conn.prototype.handleEvents = function(socket) {
  this.socket = socket
  this.handleConnection(socket)
  this.handleData(socket)
  this.handleDisconnect(socket)
}

Conn.prototype.handleConnection = function(socket) {
  var conn = this
  socket.on('connect', function() {
    conn.joinChannel()
    conn.setupHeartbeat()
  })
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
    console.log("unknown message: %s", m)
  }).on("onlineNumber", function(m) {
    console.log("# Online: %d", m.number)
  })
  conn.connect()
}

if (module.id === '.') {
  newDumbConnection(process.argv[2] || 5446)
}
