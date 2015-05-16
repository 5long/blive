var net = require("net")
  , decode = require("ent/decode")

const host = "livecmt.bilibili.com"
const port = "88"

const COMMENT = 4
const NUMBER = 1

function composeJoinChannel(channelID) {
  var buf = new Buffer(12)
  buf.write("\x01\x01\x00\x0C", 0)
  buf.writeInt32BE(channelID, 4)
  buf.write("\x00\x00\x00\x00", 8)
  return buf
}

function joinChannel(client, channelID) {
  client.write(composeJoinChannel(channelID))
}

function composeHeartbeat() {
  return new Buffer("\x01\x02\x00\x04")
}

function sendHeartbeat(client) {
  client.write(composeHeartbeat())
}

const ignoreCommands = new Set(['PREPARING', 'LIVE'])
function printComment(payload) {
  if (ignoreCommands.has(payload.cmd))

  if (payload.cmd !== "DANMU_MSG") {
    console.log("Don't know how to handle message", payload)
    return
  }

  var nick = payload.info[2][1]
    , msg = payload.info[1]

  console.log("%s : %s", nick, decode(msg))
}

function handleComment(buf) {
  var pktLength = buf.readIntBE(2, 2)
  if (pktLength !== buf.length) {
    console.log("Can't easily handle this: pktlen: %d; buflen: %d",
               pktLength, buf.length)
    return
  }

  var payload = JSON.parse(buf.toString("utf8", 4))
  printComment(payload)
}

function handleNumber(buf) {
  if (buf.length !== 6) {
    console.log("Can't easily handle number buffer: ", buf)
    return
  }
}

function printError(e) {
  if (e.code === 'EPIPE') {
    return
  }

  console.log("Shit: %s", e)
}

function reconnecting() {
  console.log("Reconnecting")
}

function newDumbConnection(channelID) {
  var hbInterval
  var client = net.connect(port, host, function() {
    var c = this
    joinChannel(c, channelID)
    hbInterval = setInterval(function() {
      sendHeartbeat(c)
    }, 55000)
  })

  client.on("data", function(buf) {
    var messageType = buf.readIntBE(0, 2)
    switch (messageType) {
      case COMMENT:
        handleComment(buf)
        break;
      case NUMBER:
        handleNumber(buf)
        break;
      default:
        console.log("unknown message type: %s", messageType)
    }
  })

  client.on("error", function(e) {
    printError(e)
    reconnecting()
    newDumbConnection(channelID)
    clearInterval(hbInterval)
    client = null
  })
}

newDumbConnection(process.argv[2] || 5446)
