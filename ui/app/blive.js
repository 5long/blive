var Chat = require("./view/chat")
  , Config = require("./model/config")
  , ConfigView = require("./view/config")
  , View = require("exoskeleton").View

module.exports = View.extend({
  el: 'body',
  events: {
    'click .config-icon': 'showConfigView',
  },
  start: function(args) {
    this.loadConfig(args)
    if (this.config.get("channelID")) this.chat()
    else this.showConfigView()
  },
  loadConfig: function(args) {
    this.config = new Config()
    this.loadArgs(args)
    this.initConfigView()
  },
  initConfigView: function() {
    this.configView = new ConfigView({
      model: this.config,
    }).render()

    this.listenTo(this.configView, 'submit', this.submitConfig)
  },
  showConfigView: function() {
    this.configView.show()
  },
  loadArgs: function(args) {
    if (args.channelID) {
      this.config.set("channelID", args.channelID)
    }
  },
  chat: function() {
    this.chatView = new Chat(this.config)
    this.chatView.render()
  },
  submitConfig: function() {
    this.configView.hide()
    this.chat()
  },
})
