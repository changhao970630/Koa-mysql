class HttpException extends Error {
  //继承Error 当遇到错误的时候 new HttpException实例可以被 throw 抛出错误，然后exception中间件捕获
  constructor(message = "服务器异常", code = 500) {
    super();
    this.message = message;
    this.code = code;
  }
}

class ParameterException extends HttpException {
  constructor(message, code) {
    super();
    this.message = message || "参数错误";
    this.code = code || 400;
  }
}

class Success extends HttpException {
  constructor(message, code) {
    super();
    this.message = message || "创建成功！";
    this.code = code || 201;
  }
}

class NotFound extends HttpException {
  constructor(message, code) {
    super();
    this.message = message || "资源未找到！";
    this.code = code || 404;
  }
}
class NoAuth extends HttpException {
  constructor(message, code) {
    super();
    this.message = message || "未授权！";
    this.code = code || 401;
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  NotFound,
  NoAuth,
};
