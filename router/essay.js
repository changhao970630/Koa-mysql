const Router = require("koa-router")
const router = new Router()
const {EssayModel} = require("../models/essay")

router.post('/essay', (ctx => {
    const {title,type_id} = ctx.request.body
    console.log(title,type_id)
    EssayModel.create({
        title,type_id
    })
}))


module.exports = router
