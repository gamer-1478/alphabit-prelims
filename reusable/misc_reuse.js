const https = require('https')

function validateEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

async function fetch_get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (resp) => {
            let data = ''

            resp.on('data', (chunk) => {
                data += chunk
            });

            resp.on('end', () => {
                resolve(JSON.parse(data))
            });

        }).on('error', (err) => {
            reject('Error: ' + err.message);
        })
    })
}

module.exports = { validateEmail }