const https = require("https");

class Http {
    constructor(instance) {
        this.instance = instance
    }

    get(path, callback) {
        const options = {
            hostname: this.instance.server,
            port: this.instance.port,
            path: path,
            agent: this.instance.https,
            headers: { 'Connection': 'keep-alive' },
            rejectUnauthorized: false, // comment out this line if you use self-signed certificates
        };

        const req = https.get(options, (res) => {
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                callback(null, res, body);
            });
        });

        req.on('error', (e) => {
            console.log(e);
            this.callback && this.callback(e);
        });

        return this;
    }

    parseBodyJSON(error, res, body) {
        if (error) {
            this.callback && this.callback(error);
            return null;
        }

        if (res.statusCode !== 200) {
            this.callback && this.callback(res.statusCode);
            return null;
        }

        let answer = null;
        try {
            answer = JSON.parse(body);
        } catch (err) {
            console.log('Parse JSON error');
        }

        if (!answer) {
            this.callback && this.callback('invalid body answer');
            return null;
        }

        const retcode = parseInt(answer.retcode);
        if (retcode !== 0) {
            this.callback && this.callback(answer.retcode);
            return null;
        }

        return answer;
    }

}

module.exports = Http