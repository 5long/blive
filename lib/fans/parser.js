function parseFanNode(n) {
  var spaceLink = n.find(".t a")

  return {
    uid: spaceLink.attr("href").match(/\d+$/)[0],
    nick: spaceLink.attr("card"),
    avatar: n.find("img.face").attr("src"),
  }
}

function parseFans($) {
  var fansNodes = $(".fanslist").find("li")

  // Interface is different from Array#map
  return fansNodes.map(function(i, n) {
    return parseFanNode($(n))
  }).get()
}

module.exports = {
  parseFans: parseFans,
}
