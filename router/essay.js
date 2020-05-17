const Router = require("koa-router");
const router = new Router();
const { EssayModel } = require("../models/essay");
const { TypeModel } = require("../models/type");
const { UserModel } = require("../models/user");
const { CValidator } = require("../validators/validator");
const { Auth } = require("../middlewares/auth");
const { ParameterException, NoAuth } = require("../Utils/HttpException");
const { Op } = require("sequelize");
const includeConfig = [
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
];
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
  const { page = 1, status = 1, perPage = 10, type_id } = ctx.request.query;
  let total, d;
  if (type_id) {
    total = await EssayModel.totalUserAcount(status, user_id, type_id);
    d = await EssayModel.findAll({
      where: { user_id, status, type_id },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * Number(perPage),
      limit: Number(perPage),
      include: includeConfig,
    });
  } else {
    total = await EssayModel.totalUserAcount(status, user_id);
    d = await EssayModel.findAll({
      where: { user_id, status },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * Number(perPage),
      limit: Number(perPage),
      include: includeConfig,
    });
  }

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
  const { page = 1, status = 1, perPage = 10, title = "" } = ctx.request.query;
  const total = await EssayModel.totalPublicAcount(status, title);
  const d = await EssayModel.findAll({
    where: { status, title: { [Op.like]: `%${title}%` } },
    order: [["createdAt", "DESC"]],
    offset: (page - 1) * Number(perPage),
    limit: Number(perPage),
    include: includeConfig,
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
    include: includeConfig,
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
  const { id } = ctx.params;
  const isBelong = await EssayModel.userHasTheEassy(id, user_id);
  if (!isBelong) {
    throw new NoAuth("警告！当前文章不属于您！真在进行非法操作！");
  }
  await EssayModel.update({ status: 0 }, { where: { id } });
  ctx.body = { id };
});

router.put("/essay", new Auth().vertifyToken(), async (ctx) => {
  const body = new CValidator([
    { name: "id", errMsg: "未选择需要修改的文章！" },
    { name: "title", errMsg: "请填写文章标题" },
    { name: "remark", errMsg: "请填写备注简介" },
    { name: "content", errMsg: "请填写文章内容" },
    { name: "type_id", errMsg: "请选择文章类型" },
  ]).validate(ctx);
  const { id, title, remark, content, type_id } = body;
  const user_id = ctx.request.user.id;
  const isBelong = await EssayModel.userHasTheEassy(id, user_id);
  if (!isBelong) {
    throw new NoAuth("警告！当前文章不属于您！真在进行非法操作！");
  }
  await EssayModel.update(
    { title, remark, content, type_id },
    { where: { id } }
  );
  ctx.body = { id };
});

module.exports = router;
