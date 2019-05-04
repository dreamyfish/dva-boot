export default async function onResponse(response) {
    let ret;

    if (response.status >= 200 && response.status < 300) {
        if (response.json) {
            ret = await response.json();
        } else {
            ret = await response.text();

            try {
                ret = JSON.parse(ret);
            } catch (err) {
                ret = {
                    code: -1,
                    message: err.message
                };
            }
        }
    } else {
        ret = {
            code: -2,
            message: response.statusText
        }
    }

    return ret;
}
