import crypto from "node:crypto";
import { client } from "./mongoDB.js";
// 登录
function login({ user, password }) {
    let result;

    //coookie过期的时间
    let day = new Date();
    day.setTime(day.getTime() + 1000 * 60 * 60 * 24 * 7);
    let dayMGTStr = day.toGMTString()
    // let shanghaiTime = day.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    // let dayMGTStr = shanghaiTime.toString();
    // console.log('Shanghai time: ' + dayMGTStr);

    // 验证用户的登录信息...
    // 如果验证成功，生成一个加密的 cookie
    let token = crypto.createHmac('sha256', password).update(user).digest('hex');
    // console.log(postData);
    //验证在数据库的用户与密码
    if (user == "user" && password == "password") {
        //有，返回登录成功
        result = {
            result: true,
            user: user,
            token: token,
            expiresMGT: dayMGTStr,
            msg: "log in successfully"
        }
    } else {
        //没有，返回错误
        result = {
            result: false,
            user: user,
            msg: "failed to log in"
        }
    }
    return result;
}
// 注册
async function register({ user = 1, password = 2 }) {
    let result;

    //coookie过期的时间
    let day = new Date();
    day.setTime(day.getTime() + 1000 * 60 * 60 * 24 * 7);
    let dayMGTStr = day.toGMTString()
    // let shanghaiTime = day.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' });
    // let dayMGTStr = shanghaiTime.toString();
    // console.log('Shanghai time: ' + dayMGTStr);

    // 验证用户的登录信息...
    // 如果验证成功，生成一个加密的 cookie
    let token = crypto.createHmac('sha256', password).update(user).digest('hex');
    // console.log(token);
    //查询数据库是否有该用户
    const collection = client.db("test").collection("test");
    await collection.find({ user: "user" }).toArray().then(documents => {
        console.log(documents[1].user);
        if (!documents[1].user) {
            //没有，注册操作
            result = {
                result: true,
                user: user,
                token: token,
                expiresMGT: dayMGTStr,
                msg: "register successfully"
            }
        } else {
            //有，返回错误
            result = {
                result: false,
                user: user,
                token: token,
                msg: "failed to register"
            }
        }
        return result;

    }).then(() => client.close()).catch(err => console.error(err));

}

// 二次认证TFA
function verify() {

}
function del() {

}



export { login, register, del, verify };