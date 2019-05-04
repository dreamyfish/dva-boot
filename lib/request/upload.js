/**
 * upload
 *
 * 1. 借用 rc-upload/request, 但是返回Promise对象
 * 2. 设置返回的response的结构为 { code, data, message }
 * 3. 参数option的data为必填选项, 去掉了 file 和 filename 选项
 *
 * @author peterlevel1
 * @since 2019-05-04
 */

/**
 * @param {Object} option
 * @param {XMLHttpRequest} xhr
 * @returns {Error}
 */
function getError(option, xhr) {
    const msg = 'cannot post ' + option.action + ' ' + xhr.status + '\'';
    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = option.action;
    return err;
}

/**
 * @param {XMLHttpRequest} xhr
 * @returns
 */
function getBody(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// option {
//  action: String, [required] the url of the request
//  data: Object, [required] the map of the form data
//  onProgress: (event: { percent: number }): void,
//  --- reject -> onError: (event: Error, body?: Object): void,
//  --- resolve -> onSuccess: (body: Object): void,
//  withCredentials: Boolean,
//  headers: Object,
// }


/**
 *
 *
 * @export
 * @param {Object} [option={
 *     // [required] the url of the request
 *     action: String
 *     // [required] the map of the form data
 *     data: Object
 *     // (event: { percent: number }): void
 *     onProgress: Function
 *     withCredentials: Boolean
 *     headers: Object
 * }]
 * @example
 * ```
 * const res = upload({
 *     action: '/iloopOms/file/upload',
 *     data: {
 *         file: FileObj
 *     }
 * });
 * ```
 * @returns {Promise}
 */
export default function upload(option = {}) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();

        if (option.onProgress && xhr.upload) {
            xhr.upload.onprogress = function progress(e) {
                if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100;
                }
                option.onProgress(e);
            };
        }

        const formData = new FormData();

        Object.keys(option.data).map(function (key) {
            formData.append(key, option.data[key]);
        });
        // formData.append(option.filename, option.file);

        xhr.onerror = function error(e) {
            // option.onError(e);
            // reject({ message: e.message, error: e });
            resolve(xhr);
        };

        xhr.onload = function onload() {
            // // allow success when 2xx status
            // // see https://github.com/react-component/upload/issues/34
            // if (xhr.status < 200 || xhr.status >= 300) {
            //     // return option.onError(getError(option, xhr), getBody(xhr));
            //     const error = getError(option, xhr);
            //     reject({ message: error.message, data: getBody(xhr), error  });
            //     return;
            // }
            // // option.onSuccess(getBody(xhr), xhr);
            // resolve(getBody(xhr));
            resolve(xhr);
        };

        xhr.open('post', option.action, true);

        // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
        if (option.withCredentials && 'withCredentials' in xhr) {
            xhr.withCredentials = true;
        }

        const headers = option.headers || {};

        // when set headers['X-Requested-With'] = null , can close default XHR header
        // see https://github.com/react-component/upload/issues/33
        if (headers['X-Requested-With'] !== null) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        for (const h in headers) {
            if (headers.hasOwnProperty(h) && headers[h] !== null) {
                xhr.setRequestHeader(h, headers[h]);
            }
        }
        xhr.send(formData);

        // TODO: replace the logic of the abort below
        option.abort = function() {
            xhr.abort();
        };

        // return {
        //     abort: function abort() {
        //         xhr.abort();
        //     }
        // };
    });
}
