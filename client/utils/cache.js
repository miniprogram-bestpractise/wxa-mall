/**
 * Created by danny on 2017/2/6.
 * 封装wx缓存方法,增加过期时间判断
 */
module.exports = {
    test() {
        try {
            wx.setStorageSync('JDC_TEST', '1');
            wx.removeStorageSync('JDC_TEST');
            return true;
        } catch (e) {
            wx.showModal({
                title: '提示',
                content: '小程序缓存出现问题,请稍后使用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
            return false;
        }
    },
    /**
     * 设置 cache
     * @param key
     * @param value
     * @param expire 单位秒
     */
    set(key, value, expire){
        expire = typeof expire == 'number' ? expire * 1000 : 315360000000; //3650*24*60*60*1000 默认10年

        wx.removeStorageSync(key);
        let _time = new Date().getTime(),
            _age = expire,
            data = {};

        data._value = value;
        // 加入时间
        data._time = _time;
        // 过期时间
        data._age = _time + _age;

        try {
            wx.setStorageSync(key, data);
            return true;
        } catch (e) {
            return false;
        }
    },
    /**
     * 判断一个 cache 是否过期
     * @param key
     * @returns {boolean}
     */
    _isExpire(key) {

        let isExpire = true,
            data = wx.getStorageSync(key),
            now = new Date().getTime();

        if (data) {
            // 当前时间是否大于过期时间
            isExpire = now > data._age ? true : data; // 直接返回数据,在get里就不在取值了
        } else {
            // 没有值也是过期
        }
        return isExpire;
    },

    /**
     * 获取某个 cache 值
     * @param key
     * @returns {*}
     */
    get(key) {
        let result = this._isExpire(key),
            data = null;

        if (result !== true) {
            data = result._value;
        }

        return data;
    },

    /**
     * 删除缓存
     * @param key
     * @returns {boolean}
     */
    del(key){
        try {
            wx.removeStorageSync(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};