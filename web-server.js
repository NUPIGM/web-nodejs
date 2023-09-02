import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { parseCookie } from "./my_modules/constroller.js";
import { login, register } from "./my_modules/admin.js";

const PORT = process.env.PORT || 80;

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
      // 请求API，不同路径执行不同内容
      switch (reqUrl.pathname) {
        case "/":
          res.statusCode = 301;
          res.setHeader("Location", "/documents/index.html")
          res.setHeader("Content-Type", "text/html")
          res.end();
          break;
        case "/article":
          res.end("ok")
          break;
        case "/movie":
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
          res.end("debug,haha")
          break;
        default:
          // 使用 path 模块处理请求路径，确保只能访问 public 文件夹下的内容
          const filePath = path.join(process.cwd(), 'public', reqUrl.pathname);
          const readStream = fs.createReadStream(filePath);
          readStream.on("data", (chunk) => { })
          readStream.on("error", (err) => {
            console.log("read file strem error:", err);
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
      switch (reqUrl.pathname) {
        case "/admin":
          // 请求的数据
          let postData = "";
          req.on("data", chunk => {
            postData = postData.concat(chunk);
            // postData += chunk;
          });
          req.on("error", (err) => { console.log("admin API request error:", err); })
          req.on("end", () => {
            postData = JSON.parse(postData)

            switch (postData.task) {
              case "login":
                let result = login(postData)
                res.writeContinue//向客户端发送100 Continue 响应，需要Expect: 100-continue头部
                res.writeHead(200, {
                  "Content-Type": "application/json",
                  "Set-Cookie": [`token=${result.token};SameSite=Strict;expires=${result.expiresMGT};Path=/;Secure;HttpOnly`]
                })
                delete result.expiresMGT
                result = JSON.stringify(result)
                res.write(result)
                res.end()
                break;
              case "register":
                let result2 = register(postData)
                res.writeContinue()
                res.writeHead(200, {
                  "Content-Type": "application/json",
                  "Set-Cookie": [`token=${result2.token};SameSite=Strict;expires=${result2.expiresMGT};Path=/;Secure;HttpOnly`]
                })
                delete result2.expiresMGT
                result2 = JSON.stringify(result2)
                res.write(result2)
                res.end()

                break;
              case "delete":
                res.end("暂未开发")

              default:
                res.end()
                break;
            }
          })
          break;
        default:
          res.statusCode = 405;
          // res.setHeader("Content-type", "application/json")
          res.end("Method Not Allowed");
          break;
      }
      break;
  }

}).listen(PORT, () => { console.log("web started port:", PORT) })
