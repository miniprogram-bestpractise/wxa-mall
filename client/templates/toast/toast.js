/**
 * Created by danny on 2017/4/10.
 */

// 组件调用页面的page对象缓存
let page;

// 组件内部方法，主要是需要满足小程序的事件绑定机制
// 事件方法必须绑定在当前page对象上面
let methods = {

    /**
     * 显示添加购物车组件
     */
    showToast(){
        this.setData({
            'toast.display': 'pop-show'
        });
    },

    /**
     * 隐藏添加购物车组件
     */
    hideToast(){
        this.setData({
            'toast.display': 'pop-hide'
        });
    }
};


module.exports = {

    /**
     * 显示
     * @param curPage 当前组件调用页面的this对象
     * @param msg 显示的消息
     * @param delay 展示多长时间，到时自动隐藏
     */
    show(curPage, msg, delay){

        page = curPage;

        delay = typeof delay == 'number' ? delay : 2000 // 默认显示时间

        page.setData({
            toast: {
                msg: typeof msg == 'string' && msg.length > 0 ?  msg : '请设置提示消息',
            }
        });

        Object.assign(page, methods);

        page.showToast();

        // 延时隐藏
        setTimeout(function () {
            page.hideToast();
        }, delay);

    }
}