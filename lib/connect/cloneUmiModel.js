import { cloneDeep } from 'lodash';

const reCommonKey = /^[^\/]+\/([\s\S]+)$/;

export default function cloneUmiModel(model, namespace) {
    const m = cloneDeep(model);
    m.namespace = namespace;

    ;['effects', 'reducers'].forEach((key) => {
        const obj = m[key];
        if (!obj) {
            return;
        }

        const commonObj = {};
        Object.keys(obj).forEach(k => {
            const commonKey = k.replace(reCommonKey, '$1');
            commonObj[commonKey] = obj[k];
        });

        m[key] = commonObj;
    });

    return m;
}