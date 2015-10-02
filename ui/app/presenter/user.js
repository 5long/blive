var Model = require("exoskeleton").Model

var UserPresenter =  Model.extend({
  initialize: function(user) {
    this.user = user
  },
  toJSON: function(opts) {
    var o = this.user.toJSON(opts)
    o.userClass = UserPresenter.buildUserClass(o)
    o.profileUrl = UserPresenter.buildUserProfileUrl(o)
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
  },
  buildUserProfileUrl: function(user) {
    return "http://space.bilibili.com/" + user.id
  }
})

module.exports = UserPresenter
