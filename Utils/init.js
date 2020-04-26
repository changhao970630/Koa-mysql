const requireDirectory = require("require-directory");
const Router = require("koa-router");

class InitManger {
  static InitCore(app) {
    InitManger.app = app; //把app人口挂载到InitManger类上
    InitManger.InitLoadRouters(); //初始化挂载路由的方法
  }
  static InitLoadRouters() {
    /**
     * @params module 第一个参数固定参数module，
     * @params Url 参数要加载的模块的文件路径，
     * @params module 每次加载一个参数执行的函数，whenModuleLoad
     */
    // 在node.js中process.cwd()方法可以获取项目的根路径
    const Url = `${process.cwd()}/router`;
    const modules = requireDirectory(module, Url, { visit: whenModuleLoad });
    function whenModuleLoad(obj) {
      if (obj instanceof Router) {
        InitManger.app.use(obj.routes());
      }
    }
  }
}
module.exports = {InitManger}
