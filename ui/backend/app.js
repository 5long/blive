var BrowserWindow = require("browser-window")
  , _ = require("lodash")

var dimension = {
  whyme: {
    x: 823,
    y: 23,
    width: 545,
    height: 240,
  },
  dev: {
    x: 150,
    y: 23,
    width: 1180,
    height: 720,
  }
}

function createMainWindow(app) {
  var win = new BrowserWindow(_.merge({
    frame: false,
    transparent: true,
    'skip-taskbar': true,
    'always-on-top': true,
    type: 'splash',
    'web-preferences': {
      "direct-write": true
    },
  }, process.env.BLIVE_DEV ? dimension.dev : dimension.whyme))

  win.loadUrl('file://' + app.root + '/index.html')

  win.on("blur", function() {
    win.send("windowBlur")
  }).on("focus", function() {
    win.send("windowFocus")
  })

  if (process.env.BLIVE_DEV) {
    win.openDevTools()
    process.on("SIGUSR2", function() {
      win.openDevTools()
    })
  }
  return win
}

module.exports = function(app, channelID) {
  app.on("ready", function() {
    var mainWin = createMainWindow(app)

    mainWin.webContents.on('did-finish-load', function() {
      mainWin.send("backendReady", {channelID: channelID})
    })
  })
}
