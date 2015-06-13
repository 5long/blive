/*
 * Act as both node.js main module and Electron app entry
 */

module.exports = {
  Chat: require("../chat"),
  FanService: require("../fans/service"),
}

// Will move channelID to UI configuration later
// For now just go the easy way
function main(channelID) {
  var app = require("app")
  app.root = __dirname

  require("./backend/boilerplate")(app)

  require("./backend/app")(app, channelID)
}

if (process.type === 'browser') {
  main(process.argv[2] || '5446')
}
