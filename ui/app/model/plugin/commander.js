var Model = require('exoskeleton').Model
  , User = require('../../model/user')

module.exports = Model.extend({
  initialize(config) {
    this.chat = config.chat
  },
  run() {
    // Access level too deep. Refactoring needed
    this.chat.service.on('comment', function(m) {
      if (this.isCommandMatched(m)) {
        this.executeCommand(m)
      }
    }.bind(this))
  },
  isCommandMatched(m) {
    return m.text === '!cc'
  },
  executeCommand(m) {
    User.cache.delete(m.uid)
  },
})
