const Collection = require('exoskeleton').Collection
  , CommentMessage = require('../model/message')
  , GiftMessage = require('../model/gift_message')

module.exports = Collection.extend({
  model(attr, opts) {
    switch (attr.type) {
    case 'comment':
      return new CommentMessage(attr, opts)
    case 'sendGift':
      return new GiftMessage(attr, opts)
    default:
      throw new Error(`Unknown msg type: ${attr.type}`)
    }
  },
})
