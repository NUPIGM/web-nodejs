import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { parseCookie } from "./constroller.js";
import { blog, movie } from "./content.js";
import { error, log } from "node:console";

http.createServer((req, res) => {
    //url解析,返回一个对象(有路径、参数、地址等)。
    const reqUrl = new URL(req.url, `http://${req.headers.host}`);
    //获取req的cookie
    const cookie = req.headers.cookie || "";
    let getCookie = parseCookie(cookie);
    // 先判断请求的方法，决定处理过程
    // GET || POST
    switch (req.method) {
        case "GET":
            // res.setHeader("Content-type", "text/html");
            // res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
            // res.end("<a'>hello world</a>");
            // console.log("get");

            // 请求API，不同路径执行不同内容
            switch (reqUrl.pathname) {
                case "/":
                    res.statusCode = 301;
                    res.setHeader("Location", "/documents/index.html")
                    res.setHeader("Content-Type","text/html")
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
                case "/hello":
                    // console.log('err');
                    // let a = JSON.stringify(getCookie);
                    // let b = JSON.stringify(reqUrl);
                    // res.setHeader("Content-Type","application/json")
                    res.end("hello");
                    break;
                // 测试请求，主要返回变量的值
                case "/debug":
                    console.log("req.url:", req.url)
                    console.log("reqUrl:", reqUrl)
                    console.log("getCookie:", getCookie)
                    console.log("visiter address:", req.socket.remoteAddress)
                    console.log("searchParams", reqUrl.searchParams)
                    console.log()
                    res.end("1")
                    break;
                default:
                    // 使用 path 模块处理请求路径，确保只能访问 public 文件夹下的内容
                    const filePath = path.join(process.cwd(), 'public', reqUrl.pathname);
                    const readStream = fs.createReadStream(filePath);
                    readStream.on("data", (chunk) => { })
                    readStream.on("error", (err) => {
                        console.log("/public 路径请求:", err);
                        res.statusCode = 405;
                        // res.setHeader("Content-type", "application/json")
                        res.end("Method Not Allowed");
                    })
                    readStream.pipe(res)

                    readStream.on("end", () => {
                        
                    // res.setHeader("Content-Type","text/html")
                        
                        console.log("have user visit file,path:", filePath);
                    })

                    break;
            }
            break;
        case "POST":

            if (reqUrl.pathname === "/login") {

                // req.pipe(res)

                let day = new Date();
                day.setTime(day.getTime() + 1000 * 60 * 60 * 24);
                let dayMGTStr = day.toGMTString();



                let postData = "";
                req.on("data", chunk => {
                    postData += chunk;
                });
                req.on("error", (err) => { console.log("login API request error:", err); })
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
                        res.statusCode = 302;
                        res.setHeader("Location", "/")
                        res.setHeader("Content-Type", "application/json")
                        res.end('"{"return":"0"}"');

                    }
                    console.log(`login request data => user = \<${jsonPostData["user"]}\> , password = \<${jsonPostData["pwd"]}\>`);
                })


            }
            break;
    }

}).listen(() => { console.log("web started port:80") })
