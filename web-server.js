import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { parseCookie } from "./constroller.js";
import { blog, movie } from "./content.js";
import { error, log } from "node:console";

http.createServer((req, res) => {
    //url解析,返回一个对象(有路径、参数、地址等)。
    const reqUrl = new URL(req.url, `http://${req.headers.host}:80`);
    //获取req的cookie
    const cookie = req.headers.cookie || "";
    let getCookie = parseCookie(cookie);

    switch (req.method) {
        case "GET":
            // res.setHeader("Content-type", "text/html");
            // res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
            // res.end("<a'>hello world</a>");
            // console.log("get");
            switch (reqUrl.pathname) {
                case "/":
                    res.statusCode = 301;
                    res.setHeader("Location", "/documents/index.html")
                    res.end();
                    break;
                case "/blog/content":

                    // console.log("typeof:",typeof(getCookie));
                    // console.log("cookie:",getCookie);
                    // console.log(getCookie["a"]);
                    // console.log(getCookie["token"]);
                    if (getCookie["token"] == "4aafcdcca17303902619eb66fb0a6dd52028cce5439061116a440c8dd46814a3") {
                        res.end("ok")
                    } else {

                        res.end("not ok")
                    }
                    break;
                case "/movie/content":
                    res.end();
                    break;
                case "/db":
                    res.end();
                    break;
                case "/user":
                    res.end();

                    break;
                case "/log":
                    // console.log('err');
                    // let a = JSON.stringify(getCookie);
                    // let b = JSON.stringify(reqUrl);
                    // res.setHeader("Content-Type","application/json")
                    res.end();
                    break;
                case "/debug":
                    console.log("reqUrl:", reqUrl)
                    console.log("getCookie:", getCookie)
                    console.log("")
                    console.log()
                    console.log()
                    res.end()
                    break;
                default:
                    // 使用 path 模块处理请求路径，确保只能访问 public 文件夹下的内容
                    const filePath = path.join(process.cwd(), 'public', reqUrl.pathname);
                    const readStream = fs.createReadStream(filePath);
                    readStream.on("data", (chunk) => { })
                    readStream.on("error", (err) => {
                        console.log("/public 路径请求:", err);
                        // res.statusCode = 404;
                        // res.setHeader("Content-type", "application/json")
                        res.end();
                    })
                    readStream.pipe(res)

                    readStream.on("end", () => {
                        console.log("public is finish");
                    })
                    /*
                        fs.readFile(filePath, (err, data) => {
                            if (err) {
                                res.statusCode = 404;
                                res.setHeader("Content-type", "application/json")
                                res.end('{"msg":"null"}');
                                return;
                            }
                            // 返回读取到的文件内容
                            res.statusCode = 200;
                            res.end(data);
                        });
                    */
                    break;
            }
            break;
        case "POST":

            if (reqUrl.pathname === "/login") {

                let postData = "";
                req.on("data", chunk => {
                    postData += chunk;
                });
                // req.pipe(res)

                let day = new Date();
                day.setTime(day.getTime() + 1000 * 60 * 60 * 24);
                let dayMGTStr = day.toGMTString();



                req.on("end", () => {

                    let jsonPostData = JSON.parse(postData)
                    console.log(jsonPostData["user"], jsonPostData["pwd"])
                    // 验证用户的登录信息...
                    // 如果验证成功，生成一个加密的 cookie
                    const userId = jsonPostData["user"];  // 用户的 ID
                    const secret = jsonPostData["pwd"];  // 你的密钥
                    let token = crypto.createHmac('sha256', secret)
                        .update(userId)
                        .digest('hex');

                    if (jsonPostData["user"] == "user" && jsonPostData["pwd"] == "pwd") {

                        // res.statusCode = 302;
                        // res.setHeader("Location", "/debug")
                        res.setHeader("Set-Cookie", [`token=${token};httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`, `userId=${userId};httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`]);
                        res.end('{"return":"1"}')

                    }
                    /*
                    else if (jsonPostData["logout"]=="logout") {
                        res.setHeader("Set-Cookie", [`token="";httpOnly;secure;sameSite=Strict;path=/;expires=${dayMGTStr}`, `userId=${userId};httpOnly;secure;sameSite=Strict;path=/;expires=`]);
                        
                        res.end("logout")

                    }
                    */
                    else {
                        res.statusCode = 200;
                        // res.setHeader("Location", "/")
                        res.setHeader("Content-Type", "application/json")
                        res.end('{"return":"0"}');

                    }
                })


            }
            break;
    }

}).listen(80, () => { console.log("web started port:80") })