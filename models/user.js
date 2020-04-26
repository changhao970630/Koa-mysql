const {sequelize} = require("../Utils/db");
const {Sequelize, Model} = require("sequelize");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken")

class User extends Model {
    //验证用户 密码！
    static async verifyUser(email, password) {
        const hasUser = await this.findOne({where: {email}})
        if (!hasUser) return hasUser
        const verifyPwd = bcrypt.compareSync(password, hasUser.password)
        if (verifyPwd) {
            const {jwt} = require("../config/config");
            const token = jsonwebtoken.sign({
                id: hasUser.id,
                nickname: hasUser.nickname,
                email: hasUser.email,
            }, jwt.secretKey, {expiresIn: jwt.expiresIn})
            return {
                token
            }
        } else {
            return false
        }
    }
}

User.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true, //主键 不能重复  不能为空！
            autoIncrement: true,
        },
        nickname: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            required: true,
        },
        password: {
            required: true,
            type: Sequelize.STRING,
            set(val) {
                const salt = bcrypt.genSaltSync(10);
                const pwd = bcrypt.hashSync(val, salt);
                this.setDataValue('password', pwd)
            }
        },
        avatar: Sequelize.STRING,
    },
    {
        sequelize,
        timestamps: true,
        tableName: "user"
    }
);
module.exports = {
    UserModel: User
}
