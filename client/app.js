//app.js
import cart from './utils/cart';

App({
    onLaunch: function () {
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          env: 'dev-hnrfx',
          traceUser: true
        })
      }

      this.globalData = {
        appInfo: wx.getSystemInfoSync(),
        userInfo: {}
      }

      cart.refreshCart();
    }
})
