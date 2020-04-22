//index.js
//获取应用实例
const regeneratorRuntime = require('../../libs/runtime')
import imageUtil from '../../utils/util.js';
import formatTime from '../../utils/util.js';
import dateDiff from '../../utils/util.js';
import htmlDecode from '../../utils/util.js';
import shoppingCart from '../../templates/cart/cart';



import favor from '../../templates/favor/favor';

import cart from '../../utils/cart';


Page({
  data: {
    imagewidth: 0, //缩放后的宽
    imageheight: 0, //缩放后的高
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    goodId: 0,
    tab: 0,
    good: {},
    pageSize: 10,
    lastPages: [],
    moreLoading: false,
    imgSlides: [],
    goodsDetail:"",
    isQrShow: false,
    qrcode: '',
  },

  onLoad(options) {
    console.log(options);
    this.init(options.id);
    this.setData({
      goodId: options.id
    })
  },

  changeTab(e){
    var tab = e.currentTarget.dataset.gid
    this.setData({tab})
  },
  async init(goodId) {
    wx.showLoading({
      title: '加载中',
    });

    await this.getGoodInfo(goodId);
  },

  async getGoodInfo(goodId) {
    try {
      const db = wx.cloud.database();
      let res = await db.collection('goods').doc(goodId).get();

      wx.hideLoading();

      if (res && res.data) {
        let imgSlides = [res.data.sPicLink];

        this.setData({
          good: res.data,
          imgSlides
        })
      } else {
        wx.showToast({
          title: '加载失败，请重试',
        });
      }
    }catch (e) {
      console.error(e)
      wx.hideLoading();
      let imgSlides = ["/images/list/sku1.png","/images/list/sku1.png"];
      this.setData({
        good: {
          _id: "123",
          goods_detail: "/images/detail.png",
          iPriceReal: 0.01,
          iOriPrice: 249,
          sDescribe: "测试专用商品",
          sPicLink: "/images/list/sku1.png",
          stock: 50
        },
        imgSlides
      })
    }

  },

  /**
   * 列表渲染完成后的善后工作
   */
  renderAfterProcess(list) {
    if (list.length < this.pageSize) {
      this.data.lastPages[this.curTab] = true;
    }
    this.hideMoreLoading();
  },
  /**
   * 隐藏加载更多的loadign
   */
  hideMoreLoading() {
    this.setData({
      moreLoading: false
    });
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  imageLoad: function(e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  addToFavor(e) {
    if (!this.data.isFavor) {
      favor.add(this, this.curBiz, this.data.currentGoodsId, this.data.goodsInfo.sMallName, this.data.goodsInfo.sProfileImg, this.data.goodsInfo.iPrice * 100);
      this.setData({
        isFavor: true
      });
    }
  },

  /**
   * 添加购物车
   * @param e
   */
  addCart(e) {
    shoppingCart.init(this, this.data.goodId);
  },

  /**
   * 立刻购买
   * @param e
   */
  buyNow(e) {
    shoppingCart.init(this, this.data.goodId, 1);
  },

  async getQr() {
    if (this.data.qrcode) {
      return this.setData({
        isQrShow: true
      });
    }

    wx.showLoading({
      title: '正在生成商品码',
    });

    let goodId = this.data.goodId;
    let { result } = await wx.cloud.callFunction({
      name: 'getQrCode',
      data: {
        fileID: 'qr/' + goodId + '.png',
        path: 'pages/detail/detail?id=' + goodId
      }
    });

    this.setData({
      qrcode: result.fileID,
      isQrShow: true
    }, () => {
      wx.hideLoading();
    });    
  },

  closeQr() {
    this.setData({
      isQrShow: false
    })
  },

})