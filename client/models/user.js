/**
 * @author  daidi@live.cn
 * @desc    用户model
 */

const regeneratorRuntime = require('../libs/runtime.js');
const app = getApp();

export default {
  async checkUser() {

    let userInfo = app.globalData.userInfo || {}

    if (userInfo._openid && this.checkSession(userInfo.expireTime || 0)) {
      return userInfo;
    }

    const db = wx.cloud.database();
    const users = await db.collection('users').get();

    if (users.data.length && this.checkSession(users.data[0].expireTime || 0)) {
      userInfo = users.data[0];
      userInfo.isLoaded = true;
      app.globalData.userInfo = userInfo
      return userInfo;
    }

    return false;
  },

  goToLogin() {
    wx.switchTab({
      url: '/pages/center/center?isLoginNeeded=true',
      complete() {
        wx.showToast({
          icon: 'none',
          title: '请先登录',
          duration: 2000,
        });
      }
    });
  },

  // 检查用户是否登录态还没过期
  checkSession(expireTime = 0) {
    if (Date.now() > expireTime) {
      return false
    }

    return true
  },
};