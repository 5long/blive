/* 
 * Make remote object from electron plainified.
 */
module.exports = function plainify(wrapped) {
  var o = {}
  for (var i in wrapped) {
    o[i] = wrapped[i]
  }

  return o
}
