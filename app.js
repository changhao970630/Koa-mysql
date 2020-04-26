const Koa = require("koa");
const bodyParser  = require("koa-bodyparser")
const catchError  = require("./middlewares/exception")
const app = new Koa();
app.use(catchError)
app.use(bodyParser())
const parameter = require('koa-parameter');
parameter(app);
require("./Utils/db");
app.listen(3000);
const {InitManger} = require("./Utils/init")

InitManger.InitCore(app)
