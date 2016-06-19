#!/usr/bin/env node
const cli = require('cli')
const Chat = require('..').Chat
const FanService = require('..').FanService

const commands = {
  fans(args) {
    const uid = args[0]

    if (!(/^\d+$/.test(uid))) {
      console.error(
        'User ID must be a number, got %j instead.',
        uid)
      process.exit(3)
    }


    const fs = new FanService(uid)

    fs.on('fan', function logNewFan(fan) {
      console.log('%j', fan)
    }).start()

    process.on('SIGUSR2', fs.fetchLatest.bind(fs))
  },
  chat(args) {
    const channelID = args[0]

    if (!(/^\d+$/.test(channelID))) {
      console.error(
        'Channel ID must be a number, got %j instead.',
        channelID)
      process.exit(3)
    }


    Chat.create(channelID)
      .on('comment', function(c) {
        console.log('%s : %s', c.nick, c.text)
      })
      .on('onlineNumber', function(n) {
        console.log('# Online: %d', n)
      })
      .on('userBlocked', function(b) {
        console.log('User %s[%s] is blocked by admin',
                    b.nick, b.uid)
      })
  },
}

cli.parse(null, ['chat', 'fans'])

cli.main(function(args, opt) {
  commands[cli.command](args, opt)
})
