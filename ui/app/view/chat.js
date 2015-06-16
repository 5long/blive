var View = require("exoskeleton").View
  , Messages = require("../collection/messages")
  , ChatService = require("../service/chat")
  , MessageView = require("../view/message")
  , plainify = require("../lib/plainify")
  , User = require("../model/user")

module.exports = View.extend({
  el: "#comments",
  initialize: function(config) {
    this.channelID = config.get("channelID")
    this.msgs = new Messages()
    this.service = ChatService.create(this.channelID)
    this.tick = 0

    this.service.on("comment", function(c) {
      this.msgs.add(plainify(c))
    }.bind(this))
    this.listenTo(this.msgs, "add", this.appendMsg)
  },
  appendMsg: function(m) {
    m.withAuthor(new User({
      id: m.get("uid"),
      nick: m.get("nick")
    }))

    this.$el.prepend(new MessageView({model: m}).render().el)

    m.author.fetch()

    this.trimIfNeeded()
  },
  trimIfNeeded: function() {
    this.tick++
    if ((this.tick % 200)) return

    var oldMsgs = this.msgs.slice(0, -50)
    this.msgs.remove(oldMsgs)
  }
})
