var fetchFans = require("./fetch").fetchFans
  , inherits = require("util").inherits
  , EventEmitter = require("events")

function FanService(uid) {
  EventEmitter.call(this)
  this.uid = uid
  this.fans = {}
}

inherits(FanService, EventEmitter)

FanService.prototype.start = function() {
  this.fetchInterval = setInterval(
    this.fetch.bind(this), 1 * 60 * 1000)
  this.fetch({triggerEvent: false})
}

FanService.prototype.stop = function() {
  if (this.fetchInterval) {
    clearInterval(this.fetchInterval)
  }
}

FanService.prototype.fetch = function(opt) {
  opt = opt || {triggerEvent: true}
  fetchFans(this.uid, function(e, fans) {
    if (!e) this.handleNewFans(fans, opt)
  }.bind(this))
}

FanService.prototype.handleNewFans = function(fans, opt) {
  fans.forEach(function(fan) {
    if (this.has(fan)) {
      return
    }

    if (opt.triggerEvent) {
      this.emit("newFan", fan)
    }
    this.add(fan)
  }, this)
}

FanService.prototype.has = function(fan) {
  return this.fans.hasOwnProperty(fan.uid)
}

FanService.prototype.add = function(fan) {
  this.fans[fan.uid] = fan
}

module.exports = FanService
FanService.FanService = FanService

function main(uid) {
  var fs = new FanService(uid)
    , execFile = require("child_process").execFile
    , path = require("path")
  fs.on("newFan", function(fan) {
    execFile(path.join(__dirname, "./disp.sh"),
             [fan.nick, fan.avatar, fan.uid])
  }).start()

  process.on("SIGUSR2", function() {
    fs.fetch()
  })
}

if (require.main === module) {
  main(process.argv[2] || 451142)
}
