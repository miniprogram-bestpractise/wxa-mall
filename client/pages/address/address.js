const regeneratorRuntime = require('../../libs/runtime');
import cache from '../../utils/cache';
import User from '../../models/user';

const app = getApp();

Page({
  data: {
    userInfo: {},
    selectOnly: false,
    isLoaded: false,
    addressList: []
  },

  async onLoad(params) {
    console.log(params);
    let isLogin = await User.checkUser();

    if (!isLogin) {
      return User.goToLogin();
    }

    this.setData({
      userInfo: app.globalData.userInfo
    });

    if (params.selectonly) {
      this.setData({
        selectOnly: true
      })
    }
  },

  /**
   * 显示加载数据，因为新增完后，返回也需要初始化
   */
  onShow() {
    this.init();
  },

  init() {
    this.getAddress();
  },

  async getAddress() {
    const db = wx.cloud.database();
    let res = await db.collection('address').get();

    this.setData({
      addressList: res.data,
      isLoaded: true,
    })
  },

  addAddress(e) {
    wx.chooseAddress({
      success: async(res) => {

        const {
          cityName,
          countyName,
          detailInfo,
          nationalCode,
          postalCode,
          provinceName,
          telNumber,
          userName,
        } = res;

        const db = wx.cloud.database();
        let result = await db.collection('address').where({
          _openid: this.data.userInfo._openid
        }).get();

        if (result.data && !result.data.length) {
          let res = await db.collection('address').add({
            data: {
              cityName,
              countyName,
              detailInfo,
              nationalCode,
              postalCode,
              provinceName,
              telNumber,
              userName
            }
          });
        } else if (result.data && result.data.length) {
          let res = await db.collection('address').doc(result.data._id).set({
            data: {
              cityName,
              countyName,
              detailInfo,
              nationalCode,
              postalCode,
              provinceName,
              telNumber,
              userName
            }
          });
        }

        wx.showLoading({
          title: '添加中',
        });

        await this.getAddress();

        wx.hideLoading();
      },
      fail(e) {
        console.log(e);
      }
    })
  },

  /**
   * 删除收货地址
   */
  async del(e) {
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '删除中',
    });

    const db = wx.cloud.database();
    const res = await db.collection('address').doc(id).remove();

    await this.getAddress();

    // del local storage
    cache.del('selectedAddress');

    wx.hideLoading()
  },



  /**
   * 选择地址
   */
  select(e) {
    console.log(this.data.selectOnly)
    if (this.data.selectOnly) {
      console.log('selectedAddress', e.currentTarget.dataset.id, this.getById(e.currentTarget.dataset.id));
      cache.set('selectedAddress', this.getById(e.currentTarget.dataset.id), 3600 * 24);
      wx.navigateBack();
    }
  },

  /**
   * 通过id获取地址信息
   * @param id 地址id
   * @returns {*|T}
   */
  getById(id) {
    return this.data.addressList.find(function(v, i, a) {
      if (v.id == id) {
        return true;
      }
    });
  }

})