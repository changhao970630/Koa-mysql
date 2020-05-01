const {sequelize} = require("../Utils/db");
const {DataTypes, Model} = require("sequelize");

class Type extends Model {
    static async verifyType(typeName) {
        const hasType = await this.findOne({where: {typeName}})
        return hasType
    }

    static async verifyTypeId(id = -999) {
        const hasTypeId = await this.findOne({where: {id}})
        return hasTypeId
    }

    static async totalAcount(status) {
        const findRes = typeof status === 'string' ? await this.findAll({where:{status}}) : await this.findAll()
        return findRes.length
    }
}

Type.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, //主键 不能重复  不能为空！
        autoIncrement: true,
    },
    typeName: {
        type: DataTypes.STRING,
        unique: true,
        required: true
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    remark: {
        type: DataTypes.STRING,
        required: false
    }
}, {
    sequelize,
    timestamps: true,
    tableName: "type"
})
module.exports = {TypeModel: Type}
