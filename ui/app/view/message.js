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
  className: 'comment-item',
  template: template("#comment"),
})

module.exports = CommentView
