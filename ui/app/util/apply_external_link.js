module.exports = function(shell, $, body) {
  body.on("click", ".external-link", function() {
    var href = $(this).data("href")
    shell.openExternal(href)
  })
}
