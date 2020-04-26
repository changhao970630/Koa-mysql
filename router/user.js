const Router = require("koa-router");
const {HttpException, ParameterException} = require("../Utils/HttpException");
const {CValidator} = require("../validators/validator")
const router = new Router({});
router.post('/test', (ctx) => {
    console.log(ctx.request.body)
    const passValidated = new CValidator([
        {name: "email", errMsg: "邮箱格式错误！"},
        {name: "password", errMsg: "密码格式错误！"},
    ]).validate(ctx)
    if (passValidated) {
        ctx.body = {
            message: '验证测试通过！'
        }
    }
});
router.get('/test', (ctx) => {
    console.log(ctx.request.body)
    const passValidated = new CValidator([
        {name: "email", errMsg: "邮箱格式错误！"},
        {name: "password", errMsg: "密码格式错误！"},
        {name: "nickname", errMsg: "昵称错误！"},
    ]).validate(ctx)
    if (passValidated) {
        ctx.body = {
            message: '验证测试通过！'
        }
    }
});

module.exports = router;
