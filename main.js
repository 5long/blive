if (process.type === 'browser') {
  require('./ui')
} else {
  module.exports = require('./lib')
}
