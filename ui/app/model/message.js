var Model = require("exoskeleton").Model
  , UserPresenter = require("../presenter/user")

var Message = module.exports = Model.extend({
  toJSON: function(opts) {
    var o = Model.prototype.toJSON.call(this, opts)
    if (this.author) o.author = (new UserPresenter(this.author)).toJSON()
    o.colorFixed = Message.fixColor(o.color)
    return o
  },
  withAuthor: function(author) {
    if (this.author) {
      throw new Error(
        "Already assigned author to message " + this.id)
    }

    this.author = author

    this.listenTo(
      author, "change", this.propagateAuthorEvents)
    return this
  },
  propagateAuthorEvents: function() {
    this.trigger("userInfoFulfill", this)
    this.trigger("change", this)
  }
}, {
  fixColor: function(color) {
    var fixedHex
    if (color.hex === 'ff6868') {
      fixedHex = 'bbbb69'
    } else {
      fixedHex = color.hex
    }
    return {
      hex: fixedHex
    }
  }
})
