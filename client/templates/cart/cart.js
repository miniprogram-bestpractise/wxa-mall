/**
 * Created by danny on 2017/3/31.
 */
const regeneratorRuntime = require('../../libs/runtime');
import cache from '../../utils/cache';
import cart from '../../utils/cart';
import toast from '../toast/toast';

// 组件调用页面的page对象缓存
let page;

// 组件内部方法，主要是需要满足小程序的事件绑定机制
// 事件方法必须绑定在当前page对象上面
let methods = {

  /**
   * 显示添加购物车组件
   */
  showShoppingCart() {
    this.setData({
      'shoppingCart.display': 'cart-show'
    });
  },

  /**
   * 隐藏添加购物车组件
   */
  hideShoppingCart() {
    this.setData({
      'shoppingCart.display': 'cart-hide'
    });
  },

  /**
   * 购买数量+1
   */
  upNumInShoppingCart() {
    let buyNum = this.data.shoppingCart.buyNum || 0;
    let singleBuyLimit = this.data.shoppingCart.goods.stock;

    this.setData({
      'shoppingCart.buyNum': buyNum < singleBuyLimit ? ++buyNum : singleBuyLimit
    })
  },

  /**
   * 购买数量-1
   */
  downNumInShoppingCart() {
    let buyNum = this.data.shoppingCart.buyNum || 0;

    this.setData({
      'shoppingCart.buyNum': buyNum > 1 ? --buyNum : buyNum
    })
  },

  async addShoppingCart(e) {
    let {
      buyGoodsId,
      buyNum
    } = this.data.shoppingCart;
    let mode = e.currentTarget.dataset.mode;

    // 加入购物车
    console.log('mode: ', mode);
    if (+mode === 3) {
      cart.addToCart(this.data.shoppingCart);
      cart.refreshCart();
      this.hideShoppingCart();
      wx.showToast({
        title: '加入购物车成功',
      });
    }
    // 立即购买
    else if (+mode === 2 || +mode === 1) {
      wx.showLoading({
        title: '下单中',
      });

      let res = await wx.cloud.callFunction({
        name: 'pay',
        data: {
          type: 'unifiedorder',
          data: {
            goodsId: [buyGoodsId],
            goodsNum: [buyNum]
          }
        }
      });

      wx.hideLoading();
      this.hideShoppingCart();

      if (!res.result.code) {

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

    }
  }
};


module.exports = {

  async init(curPage, goodsId, mode = 3) {

    page = curPage;

    page.setData({
      shoppingCart: {
        buyNum: 1, // 设置默认值
        buyGoodsId: goodsId,
        mode
      }
    });

    Object.assign(page, methods);

    console.log('====goodsId====', goodsId);

    let good = await this.getGoodDetail(goodsId);

    page.setData({
      'shoppingCart.goods': good
    }, () => {
      page.showShoppingCart();
    });
  },

  async getGoodDetail(goodsId) {
    try {
      const db = wx.cloud.database();
      let res = await db.collection('goods').doc(goodsId).get();

      console.log(res)
      if (res && res.data) {
        return res.data;
      }
    }catch (e) {
      console.error(e)
      return {
        "buyGoodsId": 1000,
        "iPriceReal": 100,
        "buyNum": 2,
        "stock": 100,
        "selected": false,
        "sPicLink": "/images/list/sku1.png",
        "sNameDesc": "展示专用商品1",
      }
    }


  }
}