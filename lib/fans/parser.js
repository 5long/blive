function parseFanNode(n) {
  var spaceLink = n.find(".t a")

  return {
    uid: spaceLink.attr("href").match(/\d+$/)[0],
    nick: spaceLink.attr("card"),
    avatar: n.find("img.face").attr("src"),
  }
}

function normalizeUser(u) {
  return {
    id: String(u.fid),
    nick: u.uname,
    avatar: u.face
  }
}

function parseFans(responseText) {
  var response = JSON.parse(responseText)

  return response.data.list.map(normalizeUser)
}

module.exports = {
  parseFans: parseFans,
}
