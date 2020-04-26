class HttpException extends Error {
  //继承Error 当遇到错误的时候 new HttpException实例可以被 throw 抛出错误，然后exception中间件捕获
  constructor(message = "服务器异常", errorCode = "10000", code = 500) {
    super();
    this.message = message;
    this.errorCode = errorCode;
    this.code = code;
  }
}

class ParameterException extends HttpException {
  constructor(message, errorCode) {
    super();
    this.message = message || "参数错误";
    this.errorCode = errorCode || 400;
  }
}

module.exports = {
  HttpException,
  ParameterException,
};
