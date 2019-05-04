import request from './request';
import qs from 'querystring';

const reWhitespace = /\s+/;

/**
 * 1. obj对象的键名对应的键值为后台的请求路径
 * 2. 经过createService处理后，该键值转变为一个请求函数
 * 3. 该函数只有一个参数，类型为对象，返回值为Promise对象
 * @export
 * @param {Object} obj
 * @returns {Object}
 */
export default function createService(obj) {
    const service = {};

    Object.keys(obj).forEach((key) => {
        if (service[key]) {
            throw new Error(`[createService]: ${key}, already exists`);
        }

        let method, url;
        const val = obj[key];
        const arr = val.split(reWhitespace);

        switch (arr.length) {
            case 1:
                method = 'POST';
                url = arr[0];
            break;
            case 2:
                method = arr[0];
                url = arr[1];
            break;
        }

        service[key] = function(params = {}) {
            delFalsyParam(params);

            let options;

            switch (method.toLowerCase()) {
                case 'get':
                    options = {
                        method: 'GET',
                        body: params,
                    };
                break;
                case 'post':
                case 'post@json':
                    options = {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: JSON.stringify(params)
                    };
                break;
                case 'post@urlencoded':
                    options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        body: params
                    };
                break;
                case 'post@form': {
                    options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data;charset=UTF-8'
                        },
                        uploadOptions: params
                    };
                }
                break;
            }

            return request(url, options);
        }
    });

    return service;
}

function delFalsyParam(params) {
    Object.keys(params).forEach(key => {
        if (!params[key] && (typeof params[key] !== 'number' || isNaN(params[key]))) {
            delete params[key];
        }
    });
}

/**
 * e.g.
 * url: /api/grid/list
 * prefix: /api/grid/
 * action: list
 * @export
 * @param {String} prefix
 * @param {Array[String]} actions 接口路径的最后的斜杠后面的字符串
 * @returns {Object}
 */
export function createConventionService(prefix, actions) {
    return createService(actions.reduce((memo, action) => {
        memo[action] = `${prefix}${action}`;
        return memo;
    }, {}));
}
