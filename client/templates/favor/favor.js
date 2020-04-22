/**
 * Created by danny on 2017/4/7.
 */
import toast from '../../templates/toast/toast';

// 组件调用页面的page对象缓存
let page;

module.exports = {

    add(curPage, biz, goodsId, goodsName, goodsPic, goodsPrice){
        page = curPage;

    }
}