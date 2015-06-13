var Collection = require("exoskeleton").Collection
  , Message = require("../model/message")

module.exports = Collection.extend({
  model: Message,
})
