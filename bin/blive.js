#!/usr/bin/env node
var cli = require("cli")

var commands = {
  fans: function(args) {
    var uid = args[0]

    if (!(/^\d+$/.test(uid))) {
      console.error(
        "User ID must be a number, got %j instead.",
        uid)
      process.exit(3)
    }

    var FanService = require("..").FanService

    var fs = new FanService(uid)

    fs.on("fan", function(fan) {
      console.log("%j", fan)
    }).start()

    process.on("SIGUSR2", function() {
      fs.fetchLatest()
    })
  },
  chat: function(args) {
    var channelID = args[0]

    if (!(/^\d+$/.test(channelID))) {
      console.error(
        "Channel ID must be a number, got %j instead.",
        channelID)
      process.exit(3)
    }

    var Chat = require("..").Chat

    Chat.create(channelID)
      .on("comment", function(c) {
        console.log("%s : %s", c.nick, c.text)
      }).on("onlineNumber", function(n) {
        console.log("# Online: %d", n)
      }).on("userBlocked", function(b) {
        console.log("User %s[%s] is blocked by admin",
                    b.nick, b.uid)
      })
  },
}

cli.parse(null, ['chat', 'fans'])

cli.main(function(args, opt) {
  commands[cli.command](args, opt)
})
