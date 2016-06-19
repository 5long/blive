function fixTransparencyForLinux(app) {
  if (process.platform === 'linux') {
    app.commandLine.appendSwitch('enable-transparent-visuals')
    app.commandLine.appendSwitch('disable-gpu')
  }
}

function disableChromeLog(app) {
  app.commandLine.appendSwitch('v', -1)
  app.commandLine.appendSwitch('vmodule', 'console=0')
}

function exitHandler(app) {
  app.on('window-all-closed', function() {
    app.quit()
  })
}

module.exports = function(app) {
  fixTransparencyForLinux(app)
  disableChromeLog(app)
  exitHandler(app)
}
