var Model = require("exoskeleton").Model

var UserPresenter =  Model.extend({
  initialize: function(user) {
    this.user = user
  },
  toJSON: function(opts) {
    var o = this.user.toJSON(opts)
    o.userClass = UserPresenter.buildUserClass(o)
    return o
  }
}, {
  buildUserClass: function(user) {
    var classes = []
    if (user.isVip) {
      classes.push("user-is-vip")
    }

    if (user.isAdmin) {
      classes.push("user-is-admin")
    }

    return classes.join(" ")
  }
})

module.exports = UserPresenter
