const cloud = require("wx-server-sdk");
const uniqueString = require("unique-string");
const { WXPay, WXPayConstants, WXPayUtil } = require("wx-js-utils");
const ip = require("ip");
const {
  ENV,
  MCHID,
  KEY,
  CERT_FILE_CONTENT,
  TIMEOUT
} = require("./config/index");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口
exports.main = async function(event) {
  const { OPENID, APPID } = cloud.getWXContext();

  const pay = new WXPay({
    appId: APPID,
    mchId: MCHID,
    key: KEY,
    certFileContent: CERT_FILE_CONTENT,
    timeout: TIMEOUT,
    signType: WXPayConstants.SIGN_TYPE_MD5,
    useSandbox: false // 不使用沙箱环境
  });

  const { type, data } = event;

  const db = cloud.database();

  // 订单文档的status 0 未支付 1 已支付 2 已关闭
  switch (type) {
    // 统一下单（分别在微信支付侧和云开发数据库生成订单）
    case "unifiedorder": {
      const { goodsId = [], goodsNum = [] } = data;

      // 获得商品信息
      let res1 = await db
        .collection("goods")
        .aggregate()
        .match({
          _id: {
            $in: goodsId
          }
        })
        .end();

      if (!res1 || !res1.list.length) {
        return {
          code: 10000,
          msg: "找不到该商品"
        };
      }

      // 计算总价
      let totalAmount = 0;

      res1.list.forEach((item, key) => {
        totalAmount += goodsNum[key] * item.iPriceReal;
      });
      totalAmount = totalAmount.toFixed(2);

      // 拼凑订单参数
      const curTime = Date.now();
      const tradeNo = `${uniqueString()}`;
      const body = "make order";
      const spbill_create_ip = ip.address() || "127.0.0.1";
      const notify_url = "http://www.qq.com"; // '云函数暂时没有外网地址和HTTP触发起，暂时随便填个地址。'
      const total_fee = totalAmount * 100; // 单位：分
      const time_stamp = "" + Math.ceil(Date.now() / 1000);
      const out_trade_no = `${tradeNo}`;
      const sign_type = WXPayConstants.SIGN_TYPE_MD5;

      const orderParam = {
        body,
        spbill_create_ip,
        notify_url,
        out_trade_no,
        total_fee,
        openid: OPENID,
        trade_type: "JSAPI",
        timeStamp: time_stamp
      };

      // 在微信支付服务端生成该订单
      const { return_code, ...restData } = await pay.unifiedOrder(orderParam);

      if (return_code === "SUCCESS" && restData.result_code === "SUCCESS") {
        const { prepay_id, nonce_str } = restData;

        // 生成微信支付签名，为后在小程序端进行支付打下基础
        const sign = WXPayUtil.generateSignature(
          {
            appId: APPID,
            nonceStr: nonce_str,
            package: `prepay_id=${prepay_id}`,
            signType: "MD5",
            timeStamp: time_stamp
          },
          KEY
        );

        const orderData = {
          _id: out_trade_no,
          out_trade_no,
          time_stamp,
          nonce_str,
          sign,
          sign_type,
          body,
          total_fee,
          prepay_id,
          sign,
          status: 0, // 0表示刚创建订单
          _openid: OPENID,
          goodsId,
          goodsNum,
          totalAmount,
          createTime: db.serverDate()
        };

        const order = await db.collection("orders").add({
          data: orderData
        });
      }

      return {
        code: return_code === "SUCCESS" ? 0 : 1,
        data: {
          id: out_trade_no,
          out_trade_no,
          time_stamp,
          ...restData
        }
      };
    }

    // 进行微信支付及更新订单状态
    case "payorder": {
      {
        const { out_trade_no, prepay_id, body, total_fee, addressId } = data;

        const { return_code, ...restData } = await pay.orderQuery({
          out_trade_no
        });

        if (restData.trade_state === "SUCCESS") {
          const result = await db
            .collection("orders")
            .where({
              out_trade_no
            })
            .update({
              data: {
                status: 1,
                trade_state: restData.trade_state,
                trade_state_desc: restData.trade_state_desc,
                addressId
              }
            });
        }

        return {
          code: return_code === "SUCCESS" ? 0 : 1,
          data: restData
        };
      }
    }
  }
};
