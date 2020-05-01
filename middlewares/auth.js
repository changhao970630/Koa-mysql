const jsonwebtoken = require("jsonwebtoken")
const {jwt} = require("../config/config")
const {NoAuth} = require("../Utils/HttpException")

class Auth {
    vertifyToken() {
        const vertifyToken = async (ctx, next) => {
            const headerToken = ctx.header.authorization
            if (headerToken) {
                try {
                    await jsonwebtoken.verify(headerToken, jwt.secretKey)
                } catch (e) {
                    throw new NoAuth('用户验证错误！')
                }
            } else {
                throw new NoAuth()
            }
            await next()
        }
        return vertifyToken
    }
}


module.exports = {Auth};
