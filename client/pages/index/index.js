//index.js
//获取应用实例
const regeneratorRuntime = require('../../libs/runtime')
import imageUtil from '../../utils/util.js';
import shoppingCart from '../../templates/cart/cart';
import cart from '../../utils/cart';

Page({
  data: {
    "menuID": 1,
    "imgUrls": [{
      "id": 0,
      "sPicLink": "https://6465-dev-hnrfx-1257967285.tcb.qcloud.la/banner/slide1.png",
      "sLink": "1000",
    }, {
      "id": 1,
      "sPicLink": "https://6465-dev-hnrfx-1257967285.tcb.qcloud.la/banner/slide2.png",
      "sLink": "1001",
    }],
    "bannerHeight": 65.625,
    "scrollHeight": 0,
    "index_recommends": [], // 精品推荐
    "page": 0,
    "pageSize": 20,
    "isEnd": false
  },

  onLoad() {
    cart.refreshCart();
    this.getRecommendGoodsList();
  },

  onReady() {
    // 设置 scroll-view 高度，才能进行滚动
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.screenHeight * res.pixelRatio,
          bannerHeight: 0.175 * res.windowWidth, // 原始图片是 640*112
          imagewidth: res.windowWidth,
          imageheight: 0.440625 * res.windowWidth
        });
      }
    });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    // 刷新列表
    this.getRecommendGoodsList(true);
  },

  scrollToLower() {
    this.getRecommendGoodsList();
  },

  async getRecommendGoodsList(isRefresh = false) {
    let {
      page,
      pageSize
    } = this.data;

    if (isRefresh) {
      page = 1;
    } else {
      ++page;
    }

    const db = wx.cloud.database();
    const res1 = await db.collection('goods').count();

    let index_recommends = this.data.index_recommends;
    let skip = 0 + (page - 1) * pageSize;

    if (index_recommends.length >= res1.total) {
      return;
    }

    const res2 = await db.collection('goods').skip(skip).limit(pageSize).get();

    if (res2 && res2.data) {
      if (!isRefresh) {
        index_recommends = index_recommends.concat(res2.data);
      } else {
        index_recommends = res2.data;
      }

      this.setData({
        page,
        index_recommends,
        isEnd: index_recommends.length >= res1.total ? true : false
      })
    }
  },
  menuClick(e) {
    var id = e.currentTarget.id;
    this.setData({
      menuID: id,
    })
  },
  bigImageClick(e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    });

  },
  bindCartTap(e) {
    let id = e.currentTarget.id;
    shoppingCart.init(this, id);
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },

  imageLoad(e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  }
})