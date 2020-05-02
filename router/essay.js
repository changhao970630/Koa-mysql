const Router = require("koa-router")
const router = new Router()
const {EssayModel} = require("../models/essay")
const {TypeModel} = require("../models/type")
const {UserModel} = require("../models/user")
const {CValidator} = require("../validators/validator")
const {Auth} = require("../middlewares/auth")
const {ParameterException} = require("../Utils/HttpException")

router.post('/essay', new Auth().vertifyToken(), (async ctx => {
    const body = new CValidator([
        {name: "title", errMsg: "请填写文章标题"},
        {name: "remark", errMsg: "请填写备注简介"},
        {name: "content", errMsg: "请填写文章内容"},
        {name: "type_id", errMsg: "请选择文章类型"},
        {name: "user_id", errMsg: "用户失效！创建文章失败！"},
    ]).validate(ctx)
    const {title, remark, content, type_id, user_id} = body
    const createRes = await EssayModel.create({title, remark, content, type_id, user_id})
    if (createRes) ctx.body = createRes;
    return
    throw new ParameterException("创建失败")

}))
router.get('/essay', async (ctx) => {
    const {page = 1, status = 1, perPage = 10, user_id,} = ctx.request.query
    const total =await EssayModel.totalAcount(status)
    console.log(total);
    const d = await EssayModel.findAll({
        where: {user_id, status},
        offset: (page - 1) * Number(perPage),
        limit: Number(perPage),
        include: [{
            model: TypeModel,
            as: "essay_type",
            attributes: ["id", "typeName", "status"],
        }, {
            model: UserModel,
            as: "essay_user",
            attributes: ['id', 'nickname', 'email', 'avatar'],
        },
        ]
    })
    ctx.body = {
        data: d,
        meta: {
            pagination: {
                total,
                current_page: page, perPage
            }
        }
    }
});


module.exports = router
