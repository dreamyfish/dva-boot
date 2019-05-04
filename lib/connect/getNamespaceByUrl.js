import { INDEX_ROUTE_KEY } from './constants';
import getUrl from './getUrl';

const reUrlToNamespace = /^\/([\S\s]*?)(\?[\S\s]*?)?$/;

export const QUERY_SPLIT_SIGN = '-';

export default function getNamespaceByUrl(url) {
    return getUrl(url).replace(reUrlToNamespace, onMatch);
}

function onMatch(input, pathname, search) {
  const arr = pathname.split('/');

  let namespace = arr.length === 1 ? arr[0] : arr[0] + arr.slice(1).map((one) => one.charAt(0).toUpperCase() + one.slice(1)).join('');
  namespace = namespace || INDEX_ROUTE_KEY;

  const ret = !search || search.length === 1 ?
    namespace :
    namespace + QUERY_SPLIT_SIGN + search.slice(1).replace(/[\u4e00-\u9fa5]/g, (s) => encodeURIComponent(s));

  return ret;
}
