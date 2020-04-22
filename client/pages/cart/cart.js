const regeneratorRuntime = require('../../libs/runtime');
import toast from '../../templates/toast/toast';
import cart from '../../utils/cart';
import cache from '../../utils/cache';


Page({
  data: {
    editing: false, // 是否编辑状态
    checkall: false, // 选择全部
    totalPrice: 0, // 总价
    goodsList: [] // 商品列表，按供应商分类
  },

  onLoad() {

  },

  onShow() {
    this.getGoodsList();
    this.refreshTotalPrice();
  },

  getGoodsList() {
    let goodsList = cart.getCartGoods();
    if (goodsList.length) {
      this.setData({
        goodsList,
        isEmpty: false
      });
    } else {
      this.setData({
        isEmpty: true
      })
    }
  },

  /**
   * 选中单个商品
   * @param e
   */
  checkGoods(e) {
    this.selectGoods(e, true);
  },

  /**
   * 去选选中单个商品
   * @param e
   */
  uncheckGoods(e) {
    this.selectGoods(e, false);
  },

  /**
   * 统一实现选中和取消选中
   * @param e
   * @param checked
   */
  selectGoods(e, checked) {
    let d = this.getDs(e);
    let goodsList = this.data.goodsList;

    goodsList.find(function (v, i, a) {
      if (v.goods._id === d.id) {
        v.selected = checked;
        return true;
      }
    });

    this.setData({
      goodsList: this.data.goodsList
    }, () => {
      cache.set('goodsList', goodsList);
    })

    this.refreshTotalPrice();
  },

  /**
   * 购买数量+1
   * @param e
   */
  upNum(e) {
    this.changeNum(e, 1);
    this.refreshTotalPrice();
  },

  /**
   * 购买数量-1
   * @param e
   */
  downNum(e) {
    this.changeNum(e, -1);
    this.refreshTotalPrice();
  },

  /**
   * 统一实现购买数量调整
   * @param e 事件对象，获取商品id
   * @param step 加1则为1，减1则为-1
   * @returns {*}
   */
  changeNum(e, step) {
    let d = this.getDs(e);
    let goodsList = this.data.goodsList;
    let idx;

    // 从商品数组里找到对应的商品
    goodsList.find(function (v, i, a) {
      if (v.goods._id === d.id) {
        if (step < 0 && v.buyNum > 0 || step > 0 && v.buyNum + step <= v.goods.stock) {
          v.buyNum += step;
        }
        return true;
      }
    });

    this.setData({
      goodsList: this.data.goodsList
    }, () => {
      cache.set('goodsList', goodsList);
    });
  },

  /**
   * 刷新已选中商品的总价
   */
  refreshTotalPrice() {
    this.setData({
      totalPrice: this.getSelectedGoods().totalPrice
    })
  },


  /**
   * 删除商品
   * @param e
   */
  del(e) {
    var that = this,
      ids = this.getSelectedGoods().ids;

    if (ids.length == 0) {
      toast.show(this, '亲，请选择要删除的商品！')
    } else {
        that.renderGoodsList();
    }
  },

  /**
   * 跳转到支付页面
   * @param e
   */
  async makeOrder(e) {

    wx.showLoading({
      title: '下单中',
    });

    let goodsList = this.getSelectedGoods().goodsList;
    console.log(goodsList)

    let goodsId = [];
    let goodsNum = [];

    goodsList.forEach((item) => {
      goodsId.push(item.buyGoodsId);
      goodsNum.push(item.buyNum);
    });

    console.log(goodsId, goodsNum);

    let res = await wx.cloud.callFunction({
      name: 'pay', // 与下单和支付相关的云函数
      data: {
        type: 'unifiedorder', // 进行统一下单，会调用微信支付侧的接口生成一个订单号，与商城的订单相关联
        data: {
          // 传入选购商品的id和数量数组
          goodsId,
          goodsNum
        }
      }
    })

    wx.hideLoading();

    if (!res.result.code) {

      // 下单成功清理购物车.
      let goodsList = cache.get('goodsList');

      goodsList = goodsList.filter((item) => {
        if (goodsId.includes(item.buyGoodsId)) {
          return false;
        }

        return true;
      });

      cache.set('goodsList', goodsList);

      cart.refreshCart();

      // 跳转至支付页面
      wx.navigateTo({
        url: '/pages/order/order?id=' + res.result.data.id,
      })
    }
    else {
      wx.showToast({
        icon: 'none',
        title: '下单失败，请重试',
      })
    }

    console.log(res);
  },

  /**
   * 获取事件对象对应的数据集，dataset
   * @param e
   * @returns {DOMStringMap}
   */
  getDs(e) {
    return e.currentTarget.dataset;
  },

  /**
   * 获取已选中的商品的相关信息
   * @returns {{totalPrice: number, ids: Array, list: Array}}，返回对象，包括总价，id数组和商品数组三个字段
   */
  getSelectedGoods() {
    let data = {
      totalPrice: 0,
      goodsList: []
    };

    data.goodsList = this.data.goodsList;

    data.goodsList = data.goodsList.filter((item) => {
      if (item.selected) {
        return true;
      }
      return false;
    });

    data.goodsList.forEach((item) => {
      data.totalPrice += (item.buyNum * item.goods.iPriceReal);
    });

    return data;
  }
})