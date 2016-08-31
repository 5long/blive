"use strict";

const fetchFans = require('./fetch').fetchFans
  , inherits = require('util').inherits
  , EventEmitter = require('events')
  , _ = require('lodash')

function FanService(uid) {
  EventEmitter.call(this)
  this.uid = uid
  this.fans = {}
}

inherits(FanService, EventEmitter)

FanService.prototype.start = function(cb) {
  cb = cb || _.noop
  this.fetchInterval = setInterval(
    this.fetchLatest.bind(this), 1 * 60 * 1000)
  this.fetchAll(cb)
}

FanService.prototype.fetchLatest = function() {
  this.fetch({
    page: 1,
    markAsNew: true,
  })
}

FanService.prototype.fetchAll = function(cb) {
  var currentPage = 1

  function nextPageIfPossible(fans) {
    if (currentPage > 5 ||
        !fans.length) return cb()

    setTimeout(function(page) {
      this.fetch({
        page: page,
        markAsNew: false,
      }, nextPageIfPossible.bind(this))
    }.bind(this, currentPage), 500)

    currentPage++
  }

  nextPageIfPossible.call(this, [0])
}

FanService.prototype.stop = function() {
  if (this.fetchInterval) {
    clearInterval(this.fetchInterval)
  }
}

FanService.prototype.fetch = function(opt, cb) {
  _.defaults(opt, {
    markAsNew: true,
    page: 1,
  })
  cb = cb || _.noop

  fetchFans(this.uid, opt.page, function(e, fans) {
    if (!e) this.handleNewFans(fans, opt)
    cb(fans)
  }.bind(this))
}

FanService.prototype.handleNewFans = function(fans, opt) {
  fans.forEach(function(fan) {
    if (this.has(fan)) {
      return
    }

    fan.isNew = !!(opt.markAsNew)
    this.add(fan)

    this.emit("fan", fan)
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

  fs.on("fan", function(fan) {
    console.log(fan)
  }).start()

  process.on("SIGUSR2", function() {
    fs.fetchLatest()
  })
}

if (require.main === module) {
  main(process.argv[2] || 451142)
}
