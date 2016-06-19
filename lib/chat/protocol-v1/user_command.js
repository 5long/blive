const decode = require('ent/decode')

function parseColor(colorNum) {
  const colorBuf = new Buffer(3)
  colorBuf.writeUIntBE(colorNum, 0, colorBuf.length)

  return {
    hex: (`000000${colorNum.toString(16)}`).slice(-6),
    red: colorBuf[0],
    green: colorBuf[1],
    blue: colorBuf[2],
  }
}


// TODO: fix this later
module.exports = function parseComment(msg) {
  if (msg.cmd === 'ROOM_BLOCK_MSG') {
    return {
      type: 'userBlocked',
      uid: String(msg.uid),
      nick: msg.uname,
    }
  }

  if (msg.cmd === 'SEND_GIFT') {
    return {
      type: 'sendGift',
      giftId: msg.data.giftId,
      giftType: msg.data.giftType,
      giftName: msg.data.giftName,
      giftCount: msg.data.num,
      nick: msg.data.uname,
    }
  }

  if (msg.cmd === 'DANMU_MSG') {
    return {
      type: 'comment',
      uid: String(msg.info[2][0]),
      nick: msg.info[2][1],
      text: decode(msg.info[1]),
      color: parseColor(msg.info[0][3]),
      isVip: msg.info[2][3] === '1',
      isAdmin: msg.info[2][2] === 1,
    }
  }

  return {
    type: 'unknownUserMsg',
    body: msg,
  }
}
