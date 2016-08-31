var View = require("exoskeleton").View
  , Messages = require("../collection/messages")
  , ChatService = require("../service/chat")
  , MessageView = require("../view/message")
  , plainify = require("../lib/plainify")
  , User = require("../model/user")
  , Commander = require("../model/plugin/commander")

module.exports = View.extend({
  el: "#messages",
  initialize: function(config) {
    this.channelID = config.get("channelID")
    this.msgs = new Messages()
    this.service = ChatService.create(this.channelID)
    this.tick = 0

    var msgAdder = function(m) {
      this.msgs.add(plainify(m))
    }.bind(this)

    this.service.on("comment", msgAdder)
      .on("sendGift", msgAdder)
    this.listenTo(this.msgs, "add", this.appendMsg)
    new Commander({chat: this}).run()
  },
  appendMsg: function(m) {
    if (m.get('type') === 'sendGift' && m.get('giftType') === 2) {
      return
    }

    if (m.get('type') === 'comment') {
      m.withAuthor(new User({
        id: m.get("uid"),
        nick: m.get("nick"),
        isAdmin: m.get("isAdmin"),
        isVip: m.get("isVip")
      }))
      m.author.fetch()
    }

    this.$el.prepend(new MessageView({model: m}).render().el)

    this.trimIfNeeded()
  },
  trimIfNeeded: function() {
    this.tick++
    if ((this.tick % 200)) return

    var oldMsgs = this.msgs.slice(0, -50)
    this.msgs.remove(oldMsgs)
  }
})
