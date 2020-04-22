# 电商商城小程序

要完整运行该DEMO，您需要先拥有并设置一个您有权限的APPID。

## 技术选型

- 前端：小程序原生
- 后台：小程序云开发

## 如何将 DEMO 运行起来

1. 填写 `appid`
   导入小程序的时候，请填入 `appid`，或者可以在`project.config.json`中直接写入。

2. 开通云开发
   进入 DEMO 后，点击左上角的“云开发”菜单，进入控制台后开通云开发。如果已经开通过，则可忽略该步骤。

3. 填入环境云开发 `env id`
   在云开发控制台中的【设置】，【环境设置】中，获取环境 ID，并填入 `client/app.js`中`wx.cloud.init`的`env`字段中。

4. 用户注册登录能力
   （1）在云开发中，新建"users"集合
   （2）上传`cloud/functions/user-login-register`云函数

5. 导入商品
   （1）在云开发中，新建`goods`集合
   （2）导入`cloud/functions/goods.json`文件，作为`goods`集合的商品数据

6. 生成商品小程序码能力
   上传 `cloud/functions/getQrCode`云函数

7. 商品下单与支付
   （1）在云开发中，新建"orders", "address"集合
   （2）在`cloud/functions/pay/config`中，放置名为`apiclient_cert.p12`的支付证书
   （3）在`cloud/functions/pay/config`中，在`index.js`文件中填入微信支付商户相关的商户 id 和密钥，同时该微信支付商户需要跟小程序有绑定的关系。
   （4）上传`cloud/functions/pay`云函数

8. 通知能力
   （1）在小程序的管理后台，开通“订阅消息能力”
   （2）选择一次性订阅模板中的“支付成功通知”模板，并将模板字段顺序定为：

```js
订单号：{{character_string9.DATA}}

商品名称： {{thing6.DATA}}

下单时间： {{date8.DATA}}

支付金额： {{amount7.DATA}}

```

（3）复制模板 ID，并分别在`cloud/functions/pay-message/config/index.js`与`client/pages/order/order.js`的`requestMessagePermission`方法中，填入该 ID。
（4）上传`cloud/functions/pay-message/`云函数

9. 客服消息
   （1）上传`cloud/functions/customer-message`云函数
   （2）在小程序云开发的控制台中的【设置】【全局设置】的面板里，将四种消息类型的处理云函数都设置成`customer-message`云函数。
