var ipc = require("ipc")

ipc.on("backendReady", function(args) {
  var Blive = this.app = require("./app/blive.js")
  Blive.start(args)
}.bind(this))
