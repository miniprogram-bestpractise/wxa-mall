const regeneratorRuntime = require('../../libs/runtime');
const app = getApp();
import User from '../../models/user';

Page({
  db: null, // db instance
  data: {
    isAuthorized: false, // 已取得授权
    userInfo: app.globalData.userInfo,
    orderList: []
  },

  onLoad(options) {
    this.db = wx.cloud.database();
    this.checkAuthSetting();
    this.checkUser();
  },

  onShow() {
    let interval = setInterval(() => {
      if (this.data.userInfo.nickName) {
        this.getOrderList();
        clearInterval(interval);
      }
    }, 300)
  },

  // 检测权限，在旧版小程序若未授权会自己弹起授权
  checkAuthSetting() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: async (res) => {
              if (res.userInfo) {
                const userInfo = res.userInfo
                // 将用户数据放在临时对象中，用于后续写入数据库
                this.setUserTemp(userInfo)
              }

              // 如果原本就有 userInfo 数据，则重新填入，如无则填空对象
              const userInfo = this.data.userInfo || {}
              userInfo.isLoaded = true
              
              this.setData({
                userInfo,
                isAuthorized: true
              })
            }
          })
        } else {
          this.setData({
            userInfo: {
              isLoaded: true,
            }
          })
        }
      }
    })
  },

  // 检测小程序的 session 是否有效
  async checkUser() {
    const users = await this.db.collection('users').get()

    if (users.data.length) {
      wx.checkSession({
        success: () => {
          // session 未过期，并且在本生命周期一直有效
          // 数据里有用户，则直接获取
          if (User.checkSession(users.data[0].expireTime || 0)) {
            this.setUserInfo(users.data[0])
          } else {
            this.setUserInfo();
          }
        },
        fail: () => {
          // 用于更新小程序用户 session
          wx.login()
        }
      })
    }
    else {
      // 新增用户
      await this.db.collection('users').add({
        data: {}
      })
    }
  },

  // 设置用户数据
  setUserInfo(userInfo = {}, cb = () => { }) {
    userInfo.isLoaded = true

    app.globalData.userInfo = userInfo
    this.setData({
      userInfo,
    }, cb)
  },

  // 设置临时数据，待 “真正登录” 时将用户数据写入 collection "users" 中
  setUserTemp(userInfo = null, isAuthorized = true, cb = () => { }) {
    this.setData({
      userTemp: userInfo,
      isAuthorized,
    }, cb)
  },

  // 手动获取用户数据
  async bindGetUserInfoNew(e) {
    const userInfo = e.detail.userInfo
    // 将用户数据放在临时对象中，用于后续写入数据库
    this.setUserTemp(userInfo)
  },

  // 获取用户手机号码
  async bindGetPhoneNumber(e) {
    wx.showLoading({
      title: '正在获取',
    })

    try {
      const data = this.data.userTemp
      const res = await wx.cloud.callFunction({
        name: 'user-login-register',
        data: {
          phoneData: wx.cloud.CloudID(e.detail.cloudID),
          user: {
            nickName: data.nickName,
            avatarUrl: data.avatarUrl,
            gender: data.gender
          }
        }
      })

      console.log('user:', res)

      if (!res.result.code && res.result.data) {
        this.setUserInfo(res.result.data)
      }

      wx.hideLoading()

      await this.getOrderList()
    } catch (err) {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '获取手机号码失败，请重试',
        icon: 'none'
      })
    }
  },

  // 退出登录
  async bindLogout() {
    const userInfo = this.data.userInfo
    console.log(userInfo);

    await this.db.collection('users').doc(userInfo._id).update({
      data: {
        expireTime: 0
      }
    })

    this.setUserInfo()
    // 重置订单数据
    this.setData({
      orderList: []
    })
  },
  
  async getOrderList(page = 1) {
    wx.showLoading({
      title: '加载中',
    });

    const db = wx.cloud.database();
    let res = await db.collection('orders').orderBy('time_stamp', 'desc').get();

    let orders = res.data;
    let goodsId = [];

    orders.forEach((item) => {
      goodsId = goodsId.concat(item.goodsId);
    });

    let res1 = await db.collection('goods').aggregate()
      .match({
        _id: { $in: goodsId }
      })
      .end()

    orders = orders.map((order) => {
      let goods = [];
      order.goodsId.forEach((goodId) => {
        res1.list.forEach((good) => {
          if (good._id === goodId) {
            goods.push(good);
          };
        });
      });
      order.goods = goods;
      return order;
    });

    // console.log(orders);

    this.setData({
      orderList: orders
    }, () => {
      wx.hideLoading();
    });
  },

  goToPay(e) {
    let id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/order/order?id=' + id,
    });
  },

  orderDetail(e) {
    let id = e.target.dataset.id;

    console.log(id);

    wx.navigateTo({
      url: '/pages/orderstatus/orderstatus?id=' + id,
    });
  },

  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
  
})