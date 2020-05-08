const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const catchError = require("./middlewares/exception");
const cors = require("koa2-cors");
const KoaStatic = require("koa-static");
const app = new Koa();
app.use(catchError);
const path = require("path");
app.use(bodyParser());
const parameter = require("koa-parameter");
parameter(app);
require("./Utils/db");
app.listen(3000);
app.use(cors());
// console.log(path.join(process.cwd(), "static"));
app.use(KoaStatic(path.join(__dirname, "static")));
const { InitManger } = require("./Utils/init");

InitManger.InitCore(app);
