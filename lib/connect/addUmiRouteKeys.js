import { ROUTE_KEY, NAMESPACE_KEY } from './constants';
import getNamespaceByUrl from './getNamespaceByUrl';
import getUrl from './getUrl';

// src/app.js: exports.modifyRouteProps
export default function addUmiRouteKeys(props, { route }) {
    const url = getUrl();

    return {
        ...props,
        [ROUTE_KEY]: url,
        [NAMESPACE_KEY]: getNamespaceByUrl(url)
    };
}
