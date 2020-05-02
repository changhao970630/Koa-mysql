const Router = require('koa-router')
const router = new Router()
const {TypeModel} = require("../models/type")
const {Auth} = require("../middlewares/auth")
const {CValidator} = require("../validators/validator")
const {ParameterException, Success, NotFound} = require("../Utils/HttpException")
const {UserModel} = require("../models/user")
const incluedConfig = {
    model:UserModel,
    as:"type_user",
    attributes:['id','nickname','email']
}
router.post("/types",
    new Auth().vertifyToken(),
    async (ctx) => {
        const body = new CValidator([
            {name: "typeName", errMsg: "请填写类型名称"},
            {name: "remark", errMsg: "请填写备注"},
            {name: "user_id", errMsg: "用户失效！创建类型失败！"},
        ]).validate(ctx)
        const {typeName, remark,user_id} = body
        const res = await TypeModel.verifyType(typeName,user_id);//验证该用户的类型名称是否已经存在
        if (res) {
            throw new ParameterException("类型已存在！")
        }
        await TypeModel.create({typeName, remark,user_id});
        throw new Success("类型创建成功！")
    })

router.get("/types", new Auth().vertifyToken(), async (ctx) => {
    console.log(new Auth().vertifyToken())
    const {all, page = 1, status=1, perPage = 10,user_id} = ctx.request.query
    const total = await TypeModel.totalAcount(status,user_id)
    let findRes;
    if (all) {
        findRes = await TypeModel.findAll(
            {where: {status,user_id},
                include:[
                    incluedConfig
                ]
            });
        ctx.body = {
            data: findRes,
        }
    } else {
        findRes = typeof status === 'string'
            ? await TypeModel.findAll({
                offset: (page - 1) * Number(perPage),
                limit: Number(perPage),
                where: {status,user_id},
                include:[
                    incluedConfig
                ]
            })
            : await TypeModel.findAll({
                offset: (page - 1) * Number(perPage), limit: Number(perPage),
                where: {user_id},
                include:[
                    incluedConfig
                ]
            })
        ctx.body = {
            data: findRes,
            meta: {
                pagination: {
                    total,
                    current_page: page, perPage
                }
            }
        }
    }

})
router.put("/types", new Auth().vertifyToken(), async (ctx) => {
    const body = new CValidator([
        {name: "id", errMsg: "请选择修改的产品！"},
        {name: "typeName", errMsg: "请填写类型名称"},
    ]).validate(ctx)
    const {id, typeName} = body
    const resHasTypeName = await TypeModel.verifyType(typeName);//验证是否重名！
    if (resHasTypeName) {
        ctx.body = {message: "类型名称已存在！"}
        return
    }
    const resHasTypeId = await TypeModel.verifyTypeId(id)
    if (resHasTypeId) {//查到之后再修改！
        await TypeModel.update({typeName}, {where: {id}})
        ctx.body = {
            id
        }
    } else {
        ctx.body = {
            message: "类型不存在！"
        }
    }


})
router.delete("/types/:id", new Auth().vertifyToken(), async (ctx) => {
    const {id} = ctx.params
    const idExist = await TypeModel.verifyTypeId(id)
    if (!idExist) {
        throw new NotFound("类型id不存在！")
    }
    // const deleteRes = await idExist.destroy({where: {id: idExist.id}})
    //这里没有判断类型是否已经被删除！
    const deleteRes = await TypeModel.update({status: 0}, {where: {id}})
    if (deleteRes) ctx.body = {id}
})

module.exports = router
