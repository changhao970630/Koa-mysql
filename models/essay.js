const { sequelize } = require("../Utils/db"); //这个是在定义模型，挂载到的数据库信息
const { DataTypes, Model, Op } = require("sequelize");
class Essay extends Model {
  static async totalUserAcount(status, user_id, type_id) {
    if (type_id) {
      //查询用户总数
      const findRes =
        typeof status === "string"
          ? await this.findAll({ where: { status, user_id, type_id } })
          : await this.findAll({ where: { user_id, type_id } });
      return findRes.length;
    } else {
      //查询用户总数
      const findRes =
        typeof status === "string"
          ? await this.findAll({ where: { status, user_id } })
          : await this.findAll({ where: { user_id } });
      return findRes.length;
    }
  }
  static async totalPublicAcount(status, title) {
    //查询所有的文章总数
    const findRes =
      typeof status === "string"
        ? await this.findAll({
            where: { status, title: { [Op.like]: `%${title}%` } },
          })
        : await this.findAll({ where: { title: { [Op.like]: `%${title}%` } } });
    return findRes.length;
  }
  static async userHasTheEassy(id, user_id) {
    //验证用户的文章是否存在
    const userHas = this.findOne({ where: { id, user_id } });
    return userHas;
  }
}
Essay.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
    },
    remark: {
      type: DataTypes.STRING(3000),
      required: true,
    },
    content: {
      type: DataTypes.STRING(15000),
      required: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    type_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "essay",
    timestamps: true,
  }
);
module.exports = {
  EssayModel: Essay,
};
