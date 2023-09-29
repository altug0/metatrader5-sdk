const crypto = require('crypto');
const buffer = require('buffer');

class Auth {
    constructor(metatrader) {
        this.metatrader = metatrader
    }

    auth(callback) {
        if (!this.metatrader.authOption.login || !this.metatrader.authOption.password || !this.metatrader.authOption.build || !this.metatrader.authOption.agent) {
            return this;
        }
        this.metatrader.http.get(`/api/auth/start?version=${this.metatrader.authOption.build}&agent=${this.metatrader.authOption.agent}&login=${this.metatrader.authOption.login}&type=manager`, (error, res, body) => {
            const answer = this.metatrader.http.parseBodyJSON(error, res, body);
            if (answer) {
                const srvRandAnswer = this.processAuth(answer, this.metatrader.authOption.password);
                const cliRandomBuf = crypto.randomBytes(16);
                const cliRandomBufHex = cliRandomBuf.toString('hex');

                this.metatrader.http.get(`/api/auth/answer?srv_rand_answer=${srvRandAnswer}&cli_rand=${cliRandomBufHex}`, (error, res, body) => {
                    const answer = this.metatrader.http.parseBodyJSON(error, res, body);
                    if (answer && this.processAuthFinal(answer, this.metatrader.authOption.password, cliRandomBuf)) {
                        return callback()
                    } else {
                        return callback()
                    }
                });
            }
        });
    }

    processAuth(answer, password) {
        // ---
        const passMd5 = crypto.createHash('md5');
        const buf = buffer.transcode(Buffer.from(password, 'utf8'), 'utf8', 'utf16le');
        passMd5.update(buf, 'binary');
        const passMd5Digest = passMd5.digest('binary');
        // ---
        const md5 = crypto.createHash('md5');
        md5.update(passMd5Digest, 'binary');
        md5.update('WebAPI', 'ascii');
        const md5Digest = md5.digest('binary');
        // ---
        const answerMd5 = crypto.createHash('md5');
        answerMd5.update(md5Digest, 'binary');
        const buf2 = Buffer.from(answer.srv_rand, 'hex');
        answerMd5.update(buf2, 'binary');
        // ---
        return answerMd5.digest('hex');
    }

    processAuthFinal(answer, password, cliRandom) {
        // ---
        const passMd5 = crypto.createHash('md5');
        const buf = buffer.transcode(Buffer.from(password, 'utf8'), 'utf8', 'utf16le');
        passMd5.update(buf, 'binary');
        const passMd5Digest = passMd5.digest('binary');
        // ---
        const md5 = crypto.createHash('md5');
        md5.update(passMd5Digest, 'binary');
        md5.update('WebAPI', 'ascii');
        const md5Digest = md5.digest('binary');
        // ---
        const answerMd5 = crypto.createHash('md5');
        answerMd5.update(md5Digest, 'binary');
        answerMd5.update(cliRandom, 'binary');
        return answer.cli_rand_answer == answerMd5.digest('hex');
    }
}

module.exports = Auth