var ipc = require("ipc")
  , $ = require("jquery")
  , body = $(document.body)

ipc.on("backendReady", function(args) {
  var Blive = this.app = require("./app/blive.js")
  Blive.start(args)
}.bind(this))

ipc.on("windowBlur", function() {
  body.removeClass("hover")
}).on("windowFocus", function() {
  body.addClass("hover")
})

body.hover(function() {
  body.addClass("hover")
}, function() {
  body.removeClass("hover")
})
