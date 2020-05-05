const Router = require("koa-router");
const router = new Router();
const { EssayModel } = require("../models/essay");
const { TypeModel } = require("../models/type");
const { UserModel } = require("../models/user");
const { CValidator } = require("../validators/validator");
const { Auth } = require("../middlewares/auth");
const { ParameterException, NoAuth } = require("../Utils/HttpException");

router.post("/essay", new Auth().vertifyToken(), async (ctx) => {
  //添加文章
  const body = new CValidator([
    { name: "title", errMsg: "请填写文章标题" },
    { name: "remark", errMsg: "请填写备注简介" },
    { name: "content", errMsg: "请填写文章内容" },
    { name: "type_id", errMsg: "请选择文章类型" },
  ]).validate(ctx);
  const user_id = ctx.request.user.id;
  const { title, remark, content, type_id } = body;
  const createRes = await EssayModel.create({
    title,
    remark,
    content,
    type_id,
    user_id,
  });
  if (createRes) ctx.body = createRes;
  return;
  throw new ParameterException("创建失败");
});

router.get("/essay", new Auth().vertifyToken(), async (ctx) => {
  const user_id = ctx.request.user.id;
  //用户文章列表
  const { page = 1, status = 1, perPage = 10 } = ctx.request.query;
  const total = await EssayModel.totalUserAcount(status, user_id);
  const d = await EssayModel.findAll({
    where: { user_id, status },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * Number(perPage),
    limit: Number(perPage),
    include: [
      {
        model: TypeModel,
        as: "essay_type",
        attributes: ["id", "typeName", "status"],
      },
      {
        model: UserModel,
        as: "essay_user",
        attributes: ["id", "nickname", "email", "avatar"],
      },
    ],
  });
  ctx.body = {
    data: d,
    meta: {
      pagination: {
        total,
        current_page: page,
        perPage,
      },
    },
  };
});

router.get("/public/essays", async (ctx) => {
  //公共文章列表
  const { page = 1, status = 1, perPage = 10 } = ctx.request.query;
  const total = await EssayModel.totalPublicAcount(status);
  const d = await EssayModel.findAll({
    where: { status },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * Number(perPage),
    limit: Number(perPage),
    include: [
      {
        model: TypeModel,
        as: "essay_type",
        attributes: ["id", "typeName", "status"],
      },
      {
        model: UserModel,
        as: "essay_user",
        attributes: ["id", "nickname", "email", "avatar"],
      },
    ],
  });
  ctx.body = {
    data: d,
    meta: {
      pagination: {
        total,
        current_page: page,
        perPage,
      },
    },
  };
});
router.get("/essay/:id", async (ctx) => {
  //文章详情
  const { id } = ctx.params;
  const essayDetails = await EssayModel.findOne({
    where: { id },
    include: [
      {
        model: TypeModel,
        as: "essay_type",
        attributes: ["id", "typeName", "status"],
      },
      {
        model: UserModel,
        as: "essay_user",
        attributes: ["id", "nickname", "email", "avatar"],
      },
    ],
  });
  if (essayDetails) {
    ctx.body = essayDetails;
  } else {
    ctx.body = {
      message: "文章不存在！",
    };
  }
});

router.delete("/essay/:id", new Auth().vertifyToken(), async (ctx) => {
  const user_id = ctx.request.user.id;
  console.log(user_id);
  const { id } = ctx.params;
  const vertifyFindRes = await EssayModel.findOne({
    where: { id },
    include: [
      {
        model: UserModel,
        as: "essay_user",
        attributes: ["id", "nickname", "email", "avatar"],
      },
    ],
  });
  if (vertifyFindRes.essay_user.id !== user_id) {
    throw new NoAuth("警告！当前文章不属于您！真在进行非法操作！");
  }
  const deleteRes = await EssayModel.update({ status: 0 }, { where: { id } });
  ctx.body = { id };
});

module.exports = router;
