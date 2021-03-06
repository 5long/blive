var View = require("exoskeleton").View
  , template = require("../lib/template")

module.exports = View.extend({
  el: "#config",
  template: template("#config-tpl"),
  events: {
    "submit": "submit",
    "click .config-close": "submit",
  },
  render: function() {
    this.$el.html(this.template.render(this.model.toJSON()))
    return this
  },
  submit: function(e) {
    e.preventDefault()

    var newChannelID = this.$el.find("#channel-id").val()
    this.model.set({channelID: newChannelID})

    this.trigger("submit")
  },
  show: function() {
    this.$el.removeAttr("hidden")
  },
  hide: function() {
    this.$el.attr("hidden", true)
  },
})
