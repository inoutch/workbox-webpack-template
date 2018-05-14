export function isJSON(text) {
    text = (typeof text === "function") ? text() : text;
    if (typeof text !== "string") {
        return false;
    }
    try {
        (!JSON) ? eval("(" + text + ")") : JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

export function post(url, data) {
    const method = "POST";
    const body = JSON.stringify(data);
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    return new Promise((resolve, reject) => {
        fetch(url, {method, headers, body})
            .then(res => {
                if (res.status !== 200) {
                    return reject(res.status)
                }
                return res.text()
            })
            .then(text => {
                if (isJSON(text)) {
                    resolve(JSON.parse(text))
                } else {
                    resolve(text)
                }
            })
            .catch(reject)
    });
}