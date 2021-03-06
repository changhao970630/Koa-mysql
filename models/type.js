const { sequelize } = require("../Utils/db");
const { DataTypes, Model } = require("sequelize");
const { EssayModel } = require("./essay");

class Type extends Model {
  static async verifyType(typeName, user_id) {
    //验证当前用户的类型名称是否有重名
    const hasType = await this.findOne({ where: { typeName, user_id } });
    return hasType;
  }

  static async verifyTypeId(id, user_id) {
    // 验证当前用户是否有该类型
    const hasTypeId = await this.findOne({ where: { id, user_id } });
    return hasTypeId;
  }

  static async totalAcount(status, user_id) {
    const findRes =
      typeof status === "string"
        ? await this.findAll({ where: { status, user_id } })
        : await this.findAll({ where: { user_id } });
    return findRes.length;
  }
}

Type.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, //主键 不能重复  不能为空！
      autoIncrement: true,
    },
    typeName: {
      type: DataTypes.STRING,
      required: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    remark: {
      type: DataTypes.STRING,
      required: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "type",
  }
);
// Type.hasMany(EssayModel,{foreignKey:"type_id"})
EssayModel.belongsTo(Type, {
  as: "essay_type",
  foreignKey: "type_id",
  targetKey: "id",
});
module.exports = { TypeModel: Type };
