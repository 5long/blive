var net = require("net")
  , parse = require("./protocol").parse
  , events = require("events")
  , inherits = require("util").inherits

const host = "livecmt.bilibili.com"
const port = "88"

function composeJoinChannel(channelID) {
  var buf = new Buffer(12)
  buf.write("\x01\x01\x00\x0C", 0)
  buf.writeInt32BE(channelID, 4)
  buf.write("\x00\x00\x00\x00", 8)
  return buf
}

function composeHeartbeat() {
  return new Buffer("\x01\x02\x00\x04")
}

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
  this.socket.write(composeJoinChannel(this.channelID))
}

Conn.prototype.setupHeartbeat = function() {
  this.hbInterval = setInterval(function() {
    this.sendHeartbeat()
  }.bind(this), 55000)
}

Conn.prototype.sendHeartbeat = function() {
  this.socket.write(composeHeartbeat())
}

Conn.prototype.handleData = function() {
  this.socket.on("data", function(buf) {
    var messages = parse(buf)
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
