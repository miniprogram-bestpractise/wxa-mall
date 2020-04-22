/**
 * @author  daidi@live.cn
 * @desc    商品model，处理商品相关的接口和数据
 */

module.exports = {    /**
     * 获取商品详情
     * @returns {Promise.<T>}
     */
    getProductList(page) {
        console.log(page)
        return new Promise((resolve, reject) => {
            resolve({
                "list": [{
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品1",
                    "sProfileImg": "/images/list/sku1.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品2",
                    "sProfileImg": "/images/list/sku2.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品1",
                    "sProfileImg": "/images/list/sku1.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品2",
                    "sProfileImg": "/images/list/sku2.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品1",
                    "sProfileImg": "/images/list/sku1.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品2",
                    "sProfileImg": "/images/list/sku2.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品1",
                    "sProfileImg": "/images/list/sku1.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                }, {
                    "iMallId": "5477",
                    "sMallName": "【限定】展示专用商品2",
                    "sProfileImg": "/images/list/sku2.png",
                    "sMallBrief": "商品10天内发货，不支持退货，如有质量问题可换货",
                    "iPriceReal": 15,
                    "sDetailImg": ["/images/list/sku1.png", "/images/list/sku1.png"]
                },]
            })
        })
    },
}