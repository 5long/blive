var View = require("exoskeleton").View
  , template = require("../lib/template")

module.exports = View.extend({
  initialize: function() {
    this.listenTo(this.model, "userInfoFulfill", this.render)
    this.listenTo(this.model, "remove", this.remove)
  },
  tagName: 'li',
  className: 'comment-item',
  template: template("#comment"),
  render: function() {
    this.$el.html(this.template.render(this.model.toJSON()))
    return this
  },
})
