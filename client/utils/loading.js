/**
 * Created by danny on 2017/1/20.
 */

export const showLoading = function () {
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });
}

export const hideLoading = function () {
    wx.hideToast();
}