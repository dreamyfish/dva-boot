import fetch from 'dva/fetch';
import upload from './upload';
import getRequestOptions from './getRequestOptions';
import onResponse from './onResponse';

export default function request(url, options) {
    const opts = getRequestOptions(options);
    // TODO: url -> jsonp
    const reqPromise = opts.uploadOptions ?
        // TODO: upload promise 的返回值需要测一下和其他方法的一致性
        upload({ action: url, ...options.uploadOptions }) :
        fetch(url, opts);

    return reqPromise.then(onResponse);
}
