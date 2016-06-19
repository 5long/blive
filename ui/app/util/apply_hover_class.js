module.exports = function(ipc, body) {
  ipc.on('windowBlur', function() {
    body.removeClass('hover')
  }).on('windowFocus', function() {
    body.addClass('hover')
  })

  body.hover(function() {
    body.addClass('hover')
  }, function() {
    body.removeClass('hover')
  })
}
