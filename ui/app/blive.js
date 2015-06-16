var Chat = require("./view/chat")
  , Config = require("./model/config")
  , ConfigView = require("./view/config")
  , _ = require("lodash")
  , Events = require("exoskeleton").Events

var app = module.exports = {
  start: function(args) {
    app.loadConfig(args)
    if (app.config.get("channelID")) app.chat()
    else app.showConfigView()
  },
  loadConfig: function(args) {
    app.config = new Config()
    app.loadArgs(args)
    app.initConfigView()
  },
  initConfigView: function() {
    app.configView = new ConfigView({
      model: app.config,
    }).render()

    app.listenTo(app.configView, 'submit', app.submitConfig)
  },
  showConfigView: function() {
    app.configView.show()
  },
  loadArgs: function(args) {
    if (args.channelID) {
      app.config.set("channelID", args.channelID)
    }
  },
  chat: function() {
    app.view = new Chat(app.config)
    app.view.render()
  },
  submitConfig: function() {
    app.configView.hide()
    app.chat()
  },
}

_.extend(app, Events)
