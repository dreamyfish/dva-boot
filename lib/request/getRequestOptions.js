import querystring from 'querystring';

const defaultRequestOptions = {
    method: 'GET',
    credentials: 'same-origin',
};

export default function getRequestOptions(opts = {}) {
    const options = {
        ...defaultRequestOptions,
        ...opts
    };
    const method = options.method = options.method.toUpperCase();

    switch (method) {
        case 'GET':
            if (options.body) {
                options.url = `${options.url}?${querystring.stringify(options.body)}`;
                delete options.body;
            }
            break;
        case 'POST':
        case 'PUT':
        case 'DELETE':
            if (!options.headers) {
                options.headers = {
                    'Content-Type': 'application/json;charset=UTF-8'
                };
            }

            if (options.body && typeof options.body !== 'string') {
                options.body = JSON.stringify(options.body);
            }
            break;
    }

    return options;
}
