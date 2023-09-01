import crypto from "node:crypto";
// 登录
function login(req, res) {

    let day = new Date();
    day.setTime(day.getTime() + 1000 * 60 * 60 * 24);
    let dayMGTStr = day.toGMTString();

req.on("end", () => {

        let jsonPostData = JSON.parse(postData)
        // console.log(jsonPostData["user"], jsonPostData["pwd"])
        // 验证用户的登录信息...
        // 如果验证成功，生成一个加密的 cookie
        const userId = jsonPostData["user"];  // 用户的 ID
        const secret = jsonPostData["pwd"];  // 你的密钥
        let token = crypto.createHmac('sha256', secret).update(userId).digest('hex');

        if (jsonPostData["user"] == "user" && jsonPostData["pwd"] == "pwd") {

            res.statusCode = 200;
            // res.setHeader("Location", "/")
            res.setHeader("Set-Cookie", [`token=${token};httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`, `userId=${userId};httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`]);
            res.end('"{"return":"1"}"')

        }
        /*
        else if (jsonPostData["logout"]=="logout") {
            res.setHeader("Set-Cookie", [`token="";httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`, `userId=${userId};httpOnly;secure;sameSite=Strict;path=/;expires=`]);
            
            res.end("logout")

        }
        */
        else {
            res.setHeader("Content-Type", "application/json")
            res.end('"{"return":"0"}"');

        }
        console.log(`login request data => user = \<${jsonPostData["user"]}\> , password = \<${jsonPostData["pwd"]}\>`);
    })


}
// 注册
function register() {

}
// 二次认证TFA
function verify() {

}



export { login, register, verify };