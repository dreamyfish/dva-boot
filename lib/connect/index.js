import { Component, cloneElement } from 'react';
import { connect } from 'dva';
import { STORE_KEY, NAMESPACE_KEY } from './constants';

export default function connectRoute(mapStateToProps) {
    return function WrappedByConnectedRoute(WrappedComponent) {
        class ConnectedRoute extends Component {
            static displayName = `ConnectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'AnonymousComponent'})`;

            constructor(props) {
                super(props);

                this.dispatch({
                    type: '$init',
                    payload: {
                        location: { ...props.location }
                    }
                });
            }

            getStore() {
                return this.props[STORE_KEY];
            }

            getRouteStore = () => {
                return this.getStore()[this.props[NAMESPACE_KEY]];
            }

            getRouteLoading = (withEffects) => {
                const loading = this.getStore().loading;
                const namespace = this.props[NAMESPACE_KEY];

                const ret = {
                    global: !!loading.global,
                    model: !!loading.models[namespace],
                };

                if (withEffects) {
                    ret.effects = Object.keys(loading.effects).reduce((memo, key) => {
                        if (key.startsWith(namespace)) {
                            const effectKey = key.replace(`${namespace}/`, '');
                            memo[effectKey] = !!loading.effects[key];
                        }

                        return memo;
                    }, {})
                }

                return ret;
            }

            dispatch = (action) => {
                if (!action.type) {
                    throw new Error(`action with no type`);
                }

                const { dispatch } = this.props;

                if (action.type.indexOf('/') > -1) {
                    return dispatch(action);
                }

                return dispatch({
                    store: this.getRouteStore(),
                    ...action,
                    type: `${this.props[NAMESPACE_KEY]}/${action.type}`,
                });
            }

            getWrappedComponentProps() {
                let props = {
                    ...this.props,
                    namespace: this.props[NAMESPACE_KEY],
                    store: this.getRouteStore(),
                    getLoading: this.getRouteLoading,
                    dispatch: this.dispatch,
                    [STORE_KEY]: null
                };

                if (typeof mapStateToProps === 'function') {
                    props = { ...props, ...(mapStateToProps(this.getStore(), this.props[NAMESPACE_KEY]) || {}) };
                }

                delete props[STORE_KEY];

                return props;
            }

            render() {
                return <WrappedComponent {...this.getWrappedComponentProps()} />
            }
        }

        return connect((store) => ({ [STORE_KEY]: store }))(ConnectedRoute);
    }
}
