const regeneratorRuntime = require('../../libs/runtime');

Page({
    data: {
    order: {
      status: ""
    },
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

    console.log(result);

    if (result.code) {
      return wx.showToast({
        title: result.msg,
        icon: 'none'
      })
    }

    let time = new Date(result.data.createTime);

    console.log(time);

        if (result.data) {
            this.setData({
        order: {
          ...result.data,
          creatTimeString: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
        }
      }, () => {
        wx.hideLoading();
            });
        }
  },

  async refund(e) {

                wx.showLoading({
      title: '申请退款中',
    });

    const { out_trade_no } = this.data.order;

    let res = await wx.cloud.callFunction({
                            name: 'pay',
                            data: {
        type: 'refund',
                            data: {
          out_trade_no
                                    }
                                }
    });

    console.log(res);

    wx.hideLoading();
            },

  onLoad(options) {
    const {
      id
    } = options;

    console.log(options);

    this.getOrder(id);
    }
});