import { window } from 'global';
import cloneUmiModel from './cloneUmiModel';
import getNamespaceByUrl, { QUERY_SPLIT_SIGN } from './getNamespaceByUrl';

const cached = {};

// src/app.js: onStateChange
export default function registerUmiModel() {
    const namespace = getNamespaceByUrl();
    if (cached[namespace]) {
        return;
    }

    const app = window.g_app;
    const models = app._models;
    let found;

    found = models.find(one => one.namespace === namespace);
    if (found) {
        cached[namespace] = 1;
        return;
    }

    const signIndex = namespace.search(QUERY_SPLIT_SIGN);
    if (signIndex === -1) {
        return;
    }

    const targetNamespace = namespace.slice(0, signIndex);
    found = models.find(one => one.namespace === targetNamespace);
    if (!found) {
        return;
    }

    cached[namespace] = 1;
    app.model(cloneUmiModel(found, namespace));
}
