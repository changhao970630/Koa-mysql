const {sequelize} = require("../Utils/db");//这个是在定义模型，挂载到的数据库信息
const {DataTypes, Model} = require("sequelize");
class Essay extends Model {
    static async totalUserAcount(status,user_id) { //查询用户总数
        const findRes = typeof status === 'string' ? await this.findAll({where: {status,user_id}}) : await this.findAll({where:{user_id}})
        return findRes.length
    }
    static async totalPublicAcount(status) { //查询用户总数
        const findRes = typeof status === 'string' ? await this.findAll({where: {status}}) : await this.findAll({where:{}})
        return findRes.length
    }
}
Essay.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        required: true,
    },
    remark: {
        type: DataTypes.STRING(300),
        required: true,
    },
    content:{
        type: DataTypes.STRING(1500),
        required: true,
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    type_id:{
        type: DataTypes.INTEGER,
    },
    user_id:{
        type: DataTypes.INTEGER,
    },
}, {
    sequelize,
    tableName: "essay",
    timestamps: true
})
module.exports = {
    EssayModel: Essay
}

