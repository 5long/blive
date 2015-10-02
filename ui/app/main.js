var ipc = require("ipc")
  , shell = require("shell")
  , $ = require("jquery")
  , body = $(document.body)

ipc.on("backendReady", function(args) {
  var BLive = require("./app/blive.js")
  this.app = new BLive()
  this.app.start(args)
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

body.on("click", ".external-link", function() {
  var href = $(this).data("href")
  shell.openExternal(href)
})
