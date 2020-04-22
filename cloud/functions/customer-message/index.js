// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event);

  const {
    Event,
    MsgType,
  } = event

  let content = '';

  // 首次进入客服聊天窗口的自动回复
  if (MsgType === 'event' && Event === 'user_enter_tempsession') {
    content = '你好，请问有什么可以帮到你呢？'
  }
  // 其它的自动回复
  else {
    content: '收到。'
  }

  const wxContext = cloud.getWXContext()

  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content,
    },
  })

  return 'success'
}