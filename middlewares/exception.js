const { HttpException } = require("../Utils/HttpException");
const catchError = async (ctx, next) => {
  try {
    await next();
    // throw new Error('模拟报错')//模拟报错
  } catch (error) {
    console.log(error);
    if (error instanceof HttpException) {
      //已知错误 使用HttpException类抛出~！
      ctx.body = {
        message: error.message,
        request: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = error.code;
    } else {
      console.log(error);
      ctx.body = {
        msg: "we made a mistake | ~ ಥ_ಥ ~ |",
        request: `${ctx.method} ${ctx.path}`,
      };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;
