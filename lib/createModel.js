import dvaModelExtend from 'dva-model-extend';
import { cloneDeep } from 'lodash';

/**
 * 参数为 dvaModelExtend 的参数
 *
 * 自动创建的结构为
 * reducers:
 *   - initState(如果创建结果的model有state, initState会默认生成)
 *   - updateState(如果未填写的话, 自动添加此函数)
 * effects:
 *   - *$init(如果未填写的话， 自动添加此生成器函数)
 * @export
 */
export default function createModel(...args) {
    const model = dvaModelExtend(...args);

    model.reducers = model.reducers || {};
    model.effects = model.effects || {};

    // state + reducers.initState
    if (model.state) {
        const defaultState = cloneDeep(model.state);

        model.reducers.initState = function () {
            return cloneDeep(defaultState);
        };
    }

    if (!model.reducers.updateState) {
        model.reducers.updateState = updateState;
    }

    if (!model.effects.$init) {
        model.effects.$init = $init;
    }

    if (model.hasOwnProperty('namespace') && model.namespace === undefined) {
        delete model.namespace;
    }

    return model;
}

function updateState(state, { payload, success }) {
    return { ...state, ...payload };
}

function *$init(action, { put }) {
    yield put({
        type: 'initState'
    });
}
