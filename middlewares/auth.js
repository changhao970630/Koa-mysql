const jsonwebtoken = require("jsonwebtoken")
const {jwt} = require("../config/config")
const {NoAuth} = require("../Utils/HttpException")

class Auth {
    vertifyToken() {
        const vertifyToken = async (ctx, next) => {
            try {
                const headerToken = ctx.header.authorization
                await jsonwebtoken.verify(headerToken, jwt.secretKey)
                await next()
            } catch (e) {
                throw new NoAuth()
            }
        }
        return vertifyToken
    }
}


module.exports = Auth;
