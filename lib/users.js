

class Users {
    constructor(instance) {
        this.instance = instance
    }

    get(login) {
        return new Promise((resolve, rejects) => {
            const callback = (error) => {
                if (error) {
                    rejects(error);
                }
                this.instance.http.get(`/api/user/get?login=${login}`, (error, res, body) => {
                    if (error) {
                        console.log(error);
                        rejects(error);
                    }
                    const answer = this.instance.http.parseBodyJSON(error, res, body);
                    resolve(answer.answer)
                });
            }
            return this.instance.auth.auth(callback)
        })
    }
}

module.exports = Users;