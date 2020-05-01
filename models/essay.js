const {sequelize} = require("../Utils/db");//这个是在定义模型，挂载到的数据库信息
const {DataTypes, Model} = require("sequelize");
const {TypeModel} = require("./type")

class Essay extends Model {

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
}, {
    sequelize,
    tableName: "essay",
    timestamps: true
})
const essey_type = sequelize.define('essey_type',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status:{
        type: DataTypes.INTEGER,
        defaultValue:1
    }
},{tableName:"essey_type"})
Essay.belongsToMany(TypeModel,{as :'type_id',through :'essey_type',foreignKey:"essay_id"})
TypeModel.belongsToMany(Essay,{as :'essay_id',through :'essey_type',foreignKey:"type_id"})
module.exports = {
    EssayModel: Essay
}

