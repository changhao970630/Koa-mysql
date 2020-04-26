const Router = require("koa-router");
const {CValidator} = require("../validators/validator");
const {UserModel} = require("../models/user");
const {Success} = require("../Utils/HttpException");
const Auth = require("../middlewares/auth")
const router = new Router({});
router.post('/register', async (ctx) => {
    const {email, password, nickname, avatar} = ctx.request.body;
    new CValidator(
        [
            {name: "email", errMsg: "'邮箱填写错误！'"},
            {name: "password", errMsg: "'密码填写错误！'"},
            {name: "nickname", errMsg: "'昵称填写错误！'"},
            {name: "avatar", errMsg: "'头像错误！'"},
        ]
    ).validate(ctx);//参数校验
    const hasHave = await UserModel.findOne({where: {email}}) || await UserModel.findOne({where: {nickname}});
    if (hasHave) {
        ctx.body = {
            message: "用户已存在"
        }
    } else {//判断用户是否已经存在！
        await UserModel.create({email, password, nickname, avatar})
        throw new Success('用户创建成功！')
    }
})

router.post("/login", async (ctx) => {
    const {email, password} = ctx.request.body;
    new CValidator(
        [
            {name: "email", errMsg: "'邮箱填写错误！'"},
            {name: "password", errMsg: "'密码填写错误！'"},
        ]
    ).validate(ctx);//参数校验
    let res = await UserModel.verifyUser(email, password)
    if (res) {
        throw new Success(res, 200)
    } else {
        throw new Success("用户名或密码错误！", 200)
    }
})

router.post("/test",  new Auth().vertifyToken(),(ctx) => {

})

module.exports = router;
