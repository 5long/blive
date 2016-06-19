var Hogan = require('hogan.js')
  , $ = require('jquery')

function collapseWhitespace(str) {
  return str.replace(/>\s+</g, '><').trim()
}

module.exports = function(templateId) {
  return Hogan.compile(
    collapseWhitespace(
      $(templateId).html()))
}
