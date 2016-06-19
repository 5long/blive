function normalizeUser(u) {
  return {
    uid: String(u.fid),
    nick: u.uname,
    avatar: u.face,
  }
}

function parseFans(responseText) {
  const response = JSON.parse(responseText)

  return response.data.list.map(normalizeUser)
}

module.exports = {
  parseFans,
}
