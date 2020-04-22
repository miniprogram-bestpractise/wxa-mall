const cloud = require('wx-server-sdk')

const duration = 24 * 3600 * 1000 // 开发侧控制登录态有效时间

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
  const {
    OPENID,
    APPID
  } = cloud.getWXContext()

  const db = cloud.database()
  const users = await db.collection('users').where({
    _openid: OPENID
  }).get()

  if (!users.data.length) {
    return {
      message: 'user not found',
      code: 1
    }
  }

  // 进行数据解密
  const user = users.data[0]
  const phoneNumber = (event.phoneData && event.phoneData.data) ? event.phoneData.data.phoneNumber : user.phoneNumber
  const expireTime = Date.now() + duration

  try {
    // 将用户数据和手机号码数据更新到该用户数据中
    const result = await db.collection('users').where({
      _openid: OPENID
    }).update({
      data: {
        ...event.user, 
        phoneNumber,
        expireTime
      }
    })

    if (!result.stats.updated) {
      return {
        message: 'update failure',
        code: 1
      }
    }
  } catch (e) {
    return {
      message: e.message,
      code: 1
    }
  }


  return {
    message: 'success',
    code: 0,
    data: {
      ...users.data[0],
      ...event.user,
      phoneNumber,
      expireTime
    },
  }
}
