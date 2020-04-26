# Koa-mysql
Koa-mysql
+ 基于 koa-parameter实现一个验证的类
   >> useAge 
   ```angular2
```js
  const passValidated = new CValidator([
                    {name: "email", errMsg: "邮箱格式错误！"},
                    {name: "password", errMsg: "密码格式错误！"},
                    {name: "nickname", errMsg: "昵称错误！"},
                ]).validate(ctx)
                
                //当所有的验证通过之后，会返回true，否则会抛出全局异常！
                //在此项目中一些特定的验证规则 需要在validators.js文件中自己添加！
                //  只是为了在使用中方便去验证！
          

         
```
