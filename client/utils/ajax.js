// import Promise from '../libs/es6-promise.min';
import {showLoading, hideLoading} from './loading';

export const request = (method = 'GET') => (url, data) => {

    if (typeof data == 'undefined') {
        data = {
            loading: true
        }
    }

    // 可以由调用者来控制是否显示loading
    let loading = typeof data.loading == 'undefined' ? true : data.loading;
    delete data.loading;

    return new Promise((resolve, reject) => {
        console.log('new request', url, data);
        if (loading) {
            showLoading();
        }
        wx.request({
            url,
            data,
            method,
            header: {
                'Content-Type': 'application/json;'
            },
            success: function (rsp) {
                hideLoading();
                console.log('ajax result', rsp);
                if(rsp.statusCode == 200){ // 兼容处理json和jsonp
                    let result = typeof rsp.data == 'object' ? rsp.data : JSON.parse(rsp.data.replace(/[\s\n\r]*var[\s]+[a-zA-Z0-9_]+[\s]*=[\s]*/i, '').replace(/[\r\n]/g,"").replace(/[\;]$/, '').replace(/\/\*.*\*\/*/, ''));

                    console.log('ajax data', result);

                    if(result.result == 0 || result.ret == 0 || result.ret_code == 0){

                        if (result.data) {
                            resolve(result.data);
                        } else {
                            resolve(result);
                            console.log('special data format ');
                        }
                    } else {
                        if(!result.result && !result.ret){
                            resolve(result);
                            console.log('special json format ');
                        }
                        reject(result);
                    }
                } else{
                    console.error('ajax error', rsp);
                    reject(rsp)
                }
            },
            failure: function (err) {
                hideLoading();
                console.error('ajax error', err);
                reject(err)
            }
        });
    });
}
export const get = request('GET');
export const post = request('POST');
export const put = request('PUT');
export const del = request('DELETE');