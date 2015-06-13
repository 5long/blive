var Chat = require("./view/chat")

module.exports = {
  start: function(args) {
    this.chat(args)
  },
  chat: function(args) {
    this.view = new Chat(args)
    this.view.render()
  },
}
