import cache from './cache';

export default {
  refreshCart() {
    let goodsList = cache.get('goodsList') || [];
    let goodsNumber = goodsList.length;

    if (goodsNumber) {
      wx.setTabBarBadge({
        index: 2,
        text: `${goodsNumber}`
      });
    }
    else {
      wx.removeTabBarBadge({
        index: 2,
      });
    }
  },

  addToCart(product) {
    let goodsList = cache.get('goodsList') || [];

    let isExist = false;
    let index = -1;

    // 处理重复商品
    for (let i = 0, len = goodsList.length; i < len; i++) {
      if (goodsList[i].buyGoodsId === product.buyGoodsId) {
        isExist = true;
        index = i;
        break;
      }
    }

    if (isExist) {
      if (goodsList[index].buyNum + product.buyNum > goodsList[index].goods.stock) {
        return wx.showToast({
          title: '购买数量已超过库存',
        });
      }
      goodsList[index].buyNum += product.buyNum;
    }
    else {
      goodsList.push(product);
    }


    cache.set('goodsList', goodsList);
  },

  getCartGoods() {
    let goodsList = cache.get('goodsList') || [];
    return goodsList;
  }
};