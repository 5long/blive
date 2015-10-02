var ipc = require("ipc")
  , shell = require("shell")
  , $ = require("jquery")
  , applyExternalLink = require("./app/util/apply_external_link")
  , applyHoverClass = require("./app/util/apply_hover_class")

  , body = $(document.body)

ipc.on("backendReady", function(args) {
  var BLive = require("./app/blive.js")
  this.app = new BLive()
  this.app.start(args)
}.bind(this))

applyHoverClass(ipc, body)
applyExternalLink(shell, $, body)
