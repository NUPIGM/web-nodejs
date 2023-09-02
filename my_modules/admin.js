import crypto from "node:crypto";
// 登录
function login(postData) {
    let result,
        user = postData.user,
        pwd = postData.password

    //coookie过期的时间
    let day = new Date();
    day.setTime(day.getTime() + 1000 * 60*60*24*7);
    let dayMGTStr = day.toGMTString()
    // let shanghaiTime = day.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    // let dayMGTStr = shanghaiTime.toString();
    // console.log('Shanghai time: ' + dayMGTStr);

    // 验证用户的登录信息...
    // 如果验证成功，生成一个加密的 cookie
    let token = crypto.createHmac('sha256', pwd).update(user).digest('hex');
    console.log(postData);
    //验证在数据库的用户与密码
    if (postData["user"] == "user" && postData["password"] == "password") {
        //有，返回登录成功
        result = {
            result: true,
            user: postData.user,
            token: token,
            expiresMGT: dayMGTStr,
            msg: "log in successfully"
        }
    } else {
        //没有，返回错误
        result = {
            result: false,
            user: postData.user,
            msg: "failed to log in"
        }
    }
    return result;
}
// 注册
function register(postData) {
    let result,
        user = postData.user,
        pwd = postData.password

    //coookie过期的时间
    let day = new Date();
    day.setTime(day.getTime() + 1000 * 60*60*24*7);
    let dayMGTStr = day.toGMTString()
    // let shanghaiTime = day.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    // let dayMGTStr = shanghaiTime.toString();
    // console.log('Shanghai time: ' + dayMGTStr);

    // 验证用户的登录信息...
    // 如果验证成功，生成一个加密的 cookie
    let token = crypto.createHmac('sha256', pwd).update(user).digest('hex');
    console.log(postData);
    //查询数据库是否有该用户
    if (postData["user"] == "user" && postData["password"] == "password") {
        //有，注册操作
        result = {
            result: true,
            user: postData.user,
            token: token,
            expiresMGT: dayMGTStr,
            msg: "register successfully"
        }
    } else {
        //没有，返回错误
        result = {
            result: false,
            user: postData.user,
            msg: "failed to register"
        }
    }
    return result;
}

// 二次认证TFA
function verify() {

}
function del() {

}



export { login, register,del, verify };