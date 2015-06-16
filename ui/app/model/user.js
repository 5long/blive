var Model = require("exoskeleton").Model
  , remote = require("remote")
  , fetchUser = remote.require("../lib/user/scraper")
  , plainify = require("../lib/plainify")

var DEFAULT_AVATAR = 'http://static.hdslb.com/images/member/noface.gif'

var User = module.exports = Model.extend({
  defaults: {
    avatar: DEFAULT_AVATAR,
    nick: '不知名用户',
  },
  initialize: function() {
    if (User.cache.has(this.id)) {
      this.set(User.cache.get(this.id), {silent: true})
    }
  },
  sync: function(method, model, opts) {
    if (method !== 'read') {
      throw new Error("User model is read-only")
    }

    var promise = new Promise(function(resolve, reject) {
      if (User.cache.has(model.id)) {
        return resolve(User.cache.get(model.id))
      }

      fetchUser(model.id, function(e, user) {
        if (e) return reject(e)

        var u = plainify(user)
        User.cache.set(u.id, u)

        resolve(u)
      })
    })
    return promise.then(opts.success, opts.error)
  },
}, {cache: new Map()})
