var Model = require("exoskeleton").Model
  , UserPresenter = require("../presenter/user")

module.exports = Model.extend({
  toJSON: function(opts) {
    var o = Model.prototype.toJSON.call(this, opts)
    if (this.author) o.author = (new UserPresenter(this.author)).toJSON()
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
})
