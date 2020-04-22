// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

// 云函数入口函数
exports.main = async (event, context) => {
  
  const {
    id
  } = event;

  const db = cloud.database();

  try {
    console.log(id);
    let res = await db.collection('orders').doc(id).get();
    
    if (!res.data) {
      return {
        code: 10001,
        msg: '订单不存在'
      }
    }
    
    let order = res.data;
    let goodsId = order.goodsId;

    let res1 = await db.collection('goods').aggregate()
      .match({
        _id: { $in: goodsId }
      })
      .end()

    order.goods = res1.list;

    let res2 = await db.collection('address').doc(order.addressId).get();

    order.address = res2.data;

    return {
      code: 0,
      msg: '订单获取成功',
      data: {
        ...order
      }
    }

  }
  catch (e) {
    return {
      code: 10001,
      msg: '订单不存在'
    }
  }
}