var Model = require('exoskeleton').Model

var UserPresenter = Model.extend({
  initialize(user) {
    this.user = user
  },
  toJSON(opts) {
    var o = this.user.toJSON(opts)
    o.userClass = UserPresenter.buildUserClass(o)
    o.profileUrl = UserPresenter.buildUserProfileUrl(o)
    return o
  },
}, {
  buildUserClass(user) {
    var classes = []
    if (user.isVip) {
      classes.push('user-is-vip')
    }

    if (user.isAdmin) {
      classes.push('user-is-admin')
    }

    return classes.join(' ')
  },
  buildUserProfileUrl(user) {
    return 'http://space.bilibili.com/' + user.id
  },
})

module.exports = UserPresenter
