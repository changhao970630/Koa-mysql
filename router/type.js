const Router = require("koa-router");
const router = new Router();
const { TypeModel } = require("../models/type");
const { Auth } = require("../middlewares/auth");
const { CValidator } = require("../validators/validator");
const { NoAuth } = require("../Utils/HttpException");
const {
  ParameterException,
  Success,
  NotFound,
} = require("../Utils/HttpException");
const { UserModel } = require("../models/user");
const incluedConfig = {
  model: UserModel,
  as: "type_user",
  attributes: ["id", "nickname", "email"],
};
router.post("/types", new Auth().vertifyToken(), async (ctx) => {
  const user_id = ctx.request.user.id;
  const body = new CValidator([
    { name: "typeName", errMsg: "请填写类型名称" },
    { name: "remark", errMsg: "请填写备注" },
  ]).validate(ctx);
  const { typeName, remark } = body;
  const res = await TypeModel.verifyType(typeName, user_id); //验证该用户的类型名称是否已经存在
  if (res) {
    throw new Success("类型已存在！");
  }
  await TypeModel.create({ typeName, remark, user_id });
  ctx.body = "";
});

router.get("/types", new Auth().vertifyToken(), async (ctx) => {
  const user_id = ctx.request.user.id;
  const { all, page = 1, status = 1, perPage = 10 } = ctx.request.query;
  const total = await TypeModel.totalAcount(status, user_id);
  let findRes;
  if (all) {
    findRes = await TypeModel.findAll({
      order: [["createdAt", "DESC"]],
      where: { status: 1, user_id },
      include: [incluedConfig],
    });
    ctx.body = {
      data: findRes,
    };
  } else {
    findRes =
      typeof status === "string"
        ? await TypeModel.findAll({
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * Number(perPage),
            limit: Number(perPage),
            where: { status, user_id },
            include: [incluedConfig],
          })
        : await TypeModel.findAll({
            order: [["createdAt", "DESC"]],
            offset: (page - 1) * Number(perPage),
            limit: Number(perPage),
            where: { user_id },
            include: [incluedConfig],
          });
    ctx.body = {
      data: findRes,
      meta: {
        pagination: {
          total,
          current_page: page,
          perPage,
        },
      },
    };
  }
});
router.put("/types", new Auth().vertifyToken(), async (ctx) => {
  const body = new CValidator([
    { name: "id", errMsg: "请选择修改的类型！" },
    { name: "typeName", errMsg: "请填写类型名称" },
  ]).validate(ctx);
  const user_id = ctx.request.user.id;
  const { id, typeName } = body;
  const resHasTypeId = await TypeModel.verifyTypeId(id, user_id);
  if (!resHasTypeId) {
    throw new NoAuth("警告！当前标签不属于您！真在进行非法操作！");
  }
  const resHasTypeName = await TypeModel.verifyType(typeName, user_id); //验证该用户的类型是否重名！
  if (resHasTypeName) {
    ctx.body = { message: "类型名称已存在！" };
    return;
  }
  //查到之后再修改！
  await TypeModel.update({ typeName }, { where: { id } });
  ctx.body = {
    id,
  };
});
router.delete("/types/:id", new Auth().vertifyToken(), async (ctx) => {
  const user_id = ctx.request.user.id;
  const { id } = ctx.params;
  const idExist = await TypeModel.verifyTypeId(id, user_id);
  if (!idExist) {
    throw new NotFound("类型id不存在！");
  }
  console.log(idExist.status);

  await TypeModel.update(
    { status: idExist.status == 1 ? 0 : 1 },
    { where: { id } }
  );
  ctx.body = { id };
});

module.exports = router;
