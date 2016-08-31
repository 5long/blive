var View = require("exoskeleton").View
  , template = require("../lib/template")

var MessageView = View.extend({
  initialize: function() {
    this.listenTo(this.model, "userInfoFulfill", this.render)
    this.listenTo(this.model, "remove", this.remove)
  },
  tagName: 'li',
  render: function() {
    this.$el.html(this.template.render(this.model.toJSON()))
    return this
  },
})

var CommentView = MessageView.extend({
  className: 'comment-msg-item',
  template: template("#comment"),
})

var GiftMessageView = MessageView.extend({
  className: 'gift-msg-item',
  template: template("#sendGift")
})

function MessageViewFactory(opts) {
  switch (opts.model.get("type")) {
    case 'comment':
      return new CommentView(opts)
    case 'sendGift':
      return new GiftMessageView(opts)
    default:
      throw new Error("Unknown msg type: " +
                      opts.model.get('type'))
  }
}

module.exports = MessageViewFactory
