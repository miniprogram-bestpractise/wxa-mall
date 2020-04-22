// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {

  const qrResult = await cloud.openapi.wxacode.createQRCode({
    path: event.path,
    width: 500
  })

  return await cloud.uploadFile({
    cloudPath: event.fileID,
    fileContent: qrResult.buffer
  })

}