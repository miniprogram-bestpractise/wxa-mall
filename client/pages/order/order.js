const regeneratorRuntime = require('../../libs/runtime');
const app = getApp();
import cache from '../../utils/cache';

import utils from '../../utils/util.js';

Page({
    data: {
        address: {},
        order: {},
    },

    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../address/address?selectonly=1'
        })
    },
    onLoad: function(options) {
        this.init(options)
    },

    onShow: function() {
        this.setData({
            address: cache.get('selectedAddress') || {}
        }, () => {
            console.log('====address====', this.data.address);
        })
    },

    init: function(options) {
        const {
            id
        } = options;
        this.getOrder(id);
    },

    async getOrder(id) {
        wx.showLoading({
            title: '加载中',
        });

        const db = wx.cloud.database();
        let {
            result
        } = await wx.cloud.callFunction({
            name: 'getOrder',
            data: {
                id
            }
        });

        if (result.data) {
            this.setData({
                order: result.data
            })
        }

        wx.hideLoading();
    },

  async requestMessagePermission() {
    return new Promise((resolve, reject) => {
      wx.requestSubscribeMessage({
        tmplIds: ['H51CjchEtZ3SDxc3Zor3y5Uk80roylFaMchyFbiU9ac'], // 数组中填上模板ID
        success: (res) => {
          resolve(res);
        },
        fail: (res) => {
          reject(res);
        }
      })
    })
  },

  async pay(e) {

        if (!this.data.address._id) {
            return wx.showToast({
                icon: 'none',
                title: '请选择发货地址',
            });
        }

    // 方便devtools调式
    if (app.globalData.appInfo.platform !== 'devtools') {
      try {
        await this.requestMessagePermission();
      }
      catch (e) {
        return wx.showToast({
          icon: 'none',
          title: '请授权接收支付订单消息',
        })
      }
    }

        const order = this.data.order;

        // 商城订单与微信支付订单所有相关数据
        const { _id, time_stamp, nonce_str, sign, prepay_id, body, total_fee, out_trade_no } = order

        // 小程序微信支付调用接口
        wx.requestPayment({
            timeStamp: time_stamp,
            nonceStr: nonce_str,
            package: `prepay_id=${prepay_id}`,
            signType: 'MD5',
            paySign: sign,
            success: async () => {
                wx.showLoading({
                    title: '正在支付'
                })

                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1500,
                    success: async () => {

                        // 支付成功后更新订单状态
                        let {result} = await wx.cloud.callFunction({
                            name: 'pay',
                            data: {
                                type: 'payorder',
                                data: {
                                    id: _id,
                                    body,
                                    prepay_id,
                                    out_trade_no,
                                    total_fee,
                                    addressId: this.data.address._id
                                }
                            }
                        });

                        // 更新订单状态后，下发模板消息进行通知
                        let data = result.data;
                        const curTime = data.time_end;
                        const time = utils.formatTimeString(curTime);
                        const messageResult = await wx.cloud.callFunction({
                            name: 'pay-message',
                            data: {
                                page: `pages/pay-result/index?id=${out_trade_no}`,
                                data: {
                  character_string9: {
                                        value: out_trade_no // 订单号
                                    },
                  thing6: {
                                        value: body // 物品名称
                                    },
                  date8: {
                                        value: time // 支付时间
                                    },
                  amount7: {
                                        value: total_fee / 100 + '元' // 支付金额
                                    }
                                }
                            }
                        })

                        console.log(messageResult);

                        wx.redirectTo({
                            url: '/pages/orderstatus/orderstatus?id=' + _id,
                        });
                        wx.hideLoading()
                    }
                })
            },
            fail() { }
        })
    }
})