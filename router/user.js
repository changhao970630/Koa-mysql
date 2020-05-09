const Router = require("koa-router");
const { CValidator } = require("../validators/validator");
const { UserModel } = require("../models/user");
const { Success, ParameterException } = require("../Utils/HttpException");
const { Auth } = require("../middlewares/auth");
const router = new Router({});
router.post("/register", async (ctx) => {
  const body = new CValidator([
    { name: "email", errMsg: "'邮箱填写错误！'" },
    { name: "password", errMsg: "'密码填写错误！'" },
    { name: "nickname", errMsg: "'昵称填写错误！'" },
    { name: "avatar", errMsg: "'头像错误！'" },
  ]).validate(ctx); //参数校验
  const { email, password, nickname, avatar } = body;
  const hasHave =
    (await UserModel.findOne({ where: { email } })) ||
    (await UserModel.findOne({ where: { nickname } })); //可以优化在model中查询是否存在！
  if (hasHave) {
    ctx.body = {
      message: "用户已存在!!",
    };
  } else {
    //判断用户是否已经存在！
    await UserModel.create({ email, password, nickname, avatar });
    throw new Success("用户创建成功！");
  }
});
router.post("/login", async (ctx) => {
  const body = new CValidator([
    { name: "email", errMsg: "'邮箱填写错误！'" },
    { name: "password", errMsg: "'密码填写错误！'" },
  ]).validate(ctx); //参数校验
  const { email, password } = body;
  let res = await UserModel.verifyUser(email, password);
  if (res) {
    ctx.body = res;
  } else {
    throw new Success("用户名或密码错误！", 200);
  }
});

router.put("/user/update", new Auth().vertifyToken(), async (ctx) => {
  const body = new CValidator([
    { name: "id", errMsg: "用户未知" },
    { name: "avatar", errMsg: "头像未知" },
    { name: "nickname", errMsg: "昵称未知" },
  ]).validate(ctx);
  const { id, avatar, nickname } = body;
  const user_id = ctx.request.user.id;
  if (id !== user_id) {
    throw new ParameterException("用户验证错误！无法继续操作", 200);
  }
  const updateRes = await UserModel.update(
    { avatar, nickname },
    { where: { id } }
  );
  ctx.body = {
    id,
  };
});
module.exports = router;
