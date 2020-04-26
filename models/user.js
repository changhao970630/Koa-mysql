const { sequelize } = require("../Utils/db");
const { Sequelize, Model } = require("sequelize");
class User extends Model {}

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
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: Sequelize.STRING,
    avatar: Sequelize.STRING,
  },
  {
    sequelize,
    timestamps: true,
    tableName:"user"
  }
);
