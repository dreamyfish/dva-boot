import { cloneElement } from 'react';
import { ROUTE_KEY, NAMESPACE_KEY } from './constants';
import getNamespaceByUrl from './getNamespaceByUrl';

export default function renderRouteFromLayout(routeComponent, url) {
    if (!routeComponent) {
        return null;
    }

    return cloneElement(routeComponent, {
        [ROUTE_KEY]: url,
        [NAMESPACE_KEY]: getNamespaceByUrl(url)
    });
}
