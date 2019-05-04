import { cloneDeep } from 'lodash';
import getNamespaceByUrl from './getNamespaceByUrl';

const cached = {};

/**
 * 注册 model
 * @export
 * @param {Object} app dva生成的app对象
 * @param {Object} model 要加载的model数据对象
 * @returns
 */
export default function registerRoadhogModel(app, model) {
    const namespace = getNamespaceByUrl();
    if (cached[namespace]) {
        return;
    }

    const m = cloneDeep(model);
    m.namespace = namespace;

    cached[namespace] = 1;
    app.model(m);
}
