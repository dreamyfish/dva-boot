import { window } from 'global';

export default function getUrl(url) {
    if (!url) {
        return `${window.location.pathname}${window.location.search}`;
    }

    if (typeof url === 'string') {
        return url;
    }

    return `${url.pathname}${url.search}`;
}
