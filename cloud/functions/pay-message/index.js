const cloud = require("wx-server-sdk");
const {
  TEMPLATE_ID //模板消息ID
} = require("./config/index");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

/**
 * 云函数主入口
 * @param {Object} event 请求参数
 * @param {String} event.code 用户登录凭证
 * @param {String} event.formId 表单提交中携带的 from_id
 * @param {String} event.prepayId 支付场景中的 prepayId
 * @param {Object} event.data 模板内容
 * @param {string} event.page 点击模板卡片后的跳转页
 * @param {string} event.userInfo 用户的 openId，和小程序的 appId
 * @param {string} event.templateId 模板 id
 * @param {Object} context
 */
exports.main = async (event, context) => {
  const { OPENID, APPID } = cloud.getWXContext();

  const {
    code,
    // formId,
    data,
    page,
    appId,
    openId
  } = event;

  try {
    const messegeParam = {
      touser: OPENID,
      data,
      page,
      templateId: TEMPLATE_ID
    };

    const result = await cloud.openapi.subscribeMessage.send(messegeParam);

    return {
      code: 0
    };
  } catch (e) {
    return {
      code: 10001,
      msg: e.message
    };
  }
};
