const {get, cloneDeep} = require("lodash");
const {ParameterException} = require("../Utils/HttpException");

class CValidator {
    constructor(Rules) {
        this.Rules = Rules
        this.data = {};
        this.parsed = {};
    }

    _assembleAllParams(ctx) {
        //收集参数！
        return {
            body: ctx.request.body,
            query: ctx.request.query,
            path: ctx.params,
            header: ctx.request.header,
        };
    }
    _findParam(key) {
        //拿出请求的参数
        let value;
        value = get(this.data, ["query", key]);
        if (value) {
            return {
                value,
                path: ["query", key],
            };
        }
        value = get(this.data, ["body", key]);
        if (value) {
            return {
                value,
                path: ["body", key],
            };
        }
        value = get(this.data, ["path", key]);
        if (value) {
            return {
                value,
                path: ["path", key],
            };
        }
        value = get(this.data, ["header", key]);
        if (value) {
            return {
                value,
                path: ["header", key],
            };
        }
        return {
            value: null,
            path: [],
        };
    }

    validate(ctx) {
        let params = this._assembleAllParams(ctx);
        this.data = cloneDeep(params);
        this.parsed = cloneDeep(params);
        let t = this.Rules.map(i => {
            this.paramsCase(i, ctx)
            return this._findParam(i.name)
        })
        return true;
    }

    paramsCase(obj, ctx) {
        switch (obj.name) {
            case "email": {
                try {
                    ctx.verifyParams({
                        email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
                    });
                } catch (e) {
                    throw  new ParameterException(obj.errMsg)
                }
                break;
            }
            case "password": {
                try {
                    ctx.verifyParams({
                        password: /^[a-z0-9]+$/i
                    });
                } catch (e) {
                    throw  new ParameterException(obj.errMsg)
                }
                break;
            }
            //nickname
            case "nickname": {
                try {
                    ctx.verifyParams({
                        nickname: 'string'
                    });
                } catch (e) {
                    throw  new ParameterException(obj.errMsg)
                }
                break;
            }
            default: {
                throw  new ParameterException('参数验证错误！')
            }
        }
    }
}
module.exports = {CValidator};
