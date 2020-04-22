/**
 * @author  daidi@live.cn
 * @desc    公告model，处理公告相关的接口和数据
 */

module.exports = {
    getDetail(params) {
        return new Promise((resolve, reject) => {
            resolve({
                "info": {
                    "iSeqId": "1",
                    "sTitle": "小程序实战书籍即将上市",
                    "sContent": "<span style=\"color:#666666;background-color:#ffffff;\">这里是公告详情，仅作demo示意，不包含实际意义。商城所有购买均不发货，请读者知悉。<\/span>",
                    "dtAdd": "2020-06-01 00:00:00",
                    "dtUpdate": "2020-06-01 00:00:00"
                }
            })
        })
    }

}