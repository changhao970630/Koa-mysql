const Sequelize = require("sequelize");
const {
  DATABASE,
  USERNAME,
  PASSWORD,
  dialect,
  port,
  host,
} = require("../config/config").datebase;

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host,
  dialect,
  port,
  timezone: "+08:00", //东八时区
  logging: false,
  define: {
    timestamps: true, //自动创建createdAt&updatedAt
  },
});
sequelize.sync({
    force:true
});

module.exports = {
  sequelize,
};
