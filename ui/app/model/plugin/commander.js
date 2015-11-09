var Model = require("exoskeleton").Model
  , User = require("../../model/user")

module.exports = Model.extend({
  initialize: function(config) {
    this.chat = config.chat
  },
  run: function() {
    // Access level too deep. Refactoring needed
    this.chat.service.on("comment", function(m) {
      if (this.isCommandMatched(m)) {
        this.executeCommand(m)
      }
    }.bind(this))
  },
  isCommandMatched: function(m) {
    return m.text === "!cc"
  },
  executeCommand: function(m) {
    User.cache.delete(m.uid)
  },
})
