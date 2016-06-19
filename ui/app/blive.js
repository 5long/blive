const Chat = require('./view/chat')
  , Config = require('./model/config')
  , ConfigView = require('./view/config')
  , View = require('exoskeleton').View

module.exports = View.extend({
  el: 'body',
  events: {
    'click .config-icon': 'showConfigView',
  },
  start(args) {
    this.loadConfig(args)
    if (this.config.get('channelID')) this.chat()
    else this.showConfigView()
  },
  loadConfig(args) {
    this.config = new Config()
    this.loadArgs(args)
    this.initConfigView()
  },
  initConfigView() {
    this.configView = new ConfigView({
      model: this.config,
    }).render()

    this.listenTo(this.configView, 'submit', this.submitConfig)
  },
  showConfigView() {
    this.configView.show()
  },
  loadArgs(args) {
    if (args.channelID) {
      this.config.set('channelID', args.channelID)
    }
  },
  chat() {
    this.chatView = new Chat(this.config)
    this.chatView.render()
  },
  submitConfig() {
    this.configView.hide()
    this.chat()
  },
})
