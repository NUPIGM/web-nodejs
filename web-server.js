import { createSecureServer } from "node:http2";
import {createReadStream,readFileSync} from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import { parseCookie, gzipOn, mimeTypes } from "./my_modules/constroller.js";
import { logError } from "./my_modules/log.js";
//import { login, register } from "./my_modules/admin.js";

//端口
const PORT = process.env.PORT || 443;
//证书验证（测试证书）
const options = {
  key: readFileSync("./ssl/key.pem"),
  cert: readFileSync("./ssl/cert.pem"),
};

createSecureServer(options, (req, res) => {
  //url解析,返回一个对象(有路径、参数、地址等)。
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const cookies = req.headers.cookie || "";
  const getCookies = parseCookie(cookies);
  const ip = req.socket.remoteAddress;
  const hv = req.httpVersion;
  const acceptEncoding = req.headers["accept-encoding"];

  // 先判断请求的方法，决定处理过程
  // GET || POST
  switch (req.method) {
    case "GET": // 请求API，不同路径执行不同内容
      switch (reqUrl.pathname) {
        case "/":
          res.writeHead(301, { Location: "/documents/main.html" });
          res.end("301!");
          break;

        default:
          // 使用 path 模块处理请求路径，确保只能访问 public 文件夹下的内容
          const filePath = path.join(process.cwd(), "public", reqUrl.pathname);
          //读取文件流
          const readStream = createReadStream(filePath);

          //访问文件的MIME类型
          const fileExt = path.extname(filePath);
          const mime = mimeTypes[fileExt];

          readStream.on("data", (chunk) => {});
          readStream.on("end", () => {});
          readStream.on("error", (err) => {
            res.writeHead(404, {});
            res.end();
            // console.error("在try/catch块中捕获的错误:", err);
            logError(err, ip);
          });
          readStream.pipe(res);

          // if (mime) {
          //   res.setHeader("Content-Type", mime + ";charset=utf-8");
          // }
          // const ifNoneMatch = req.headers["if-none-match"];
          // if (ifNoneMatch === etag) {
          //   res.writeHead(304, {
          //     ETag: etag,
          //   });
          //   res.end(); // 资源未改变，返回 304 Not Modified
          // } else if (acceptEncoding.includes("br")) {
          //   res.writeHead(200, {
          //     "Content-Encoding": "br", // 设置 Brotli 压缩});
          //     ETag: etag,
          //     "Cache-Control": "public,max-age=1",
          //   });
          //   readStream.pipe(zlib.createBrotliCompress()).pipe(res);
          // } else if (acceptEncoding.includes("gzip")) {
          //   res.setHeader("Content-Encoding", "gzip");
          //   readStream.pipe(zlib.createGzip()).pipe(res);
          // } else {
          //   readStream.pipe(res);
          // }
          break;
      }

      break;
    /*
        case "POST": // 请求API，不同路径执行不同内容
        switch (reqUrl.pathname) {
          case "/admin":
            // 请求的数据
            let postData = "";
            req.on("data", (chunk) => {
              postData = postData.concat(chunk);
              // postData += chunk;
            });
            req.on("error", (err) => {
              console.log("admin API request error:", err);
            });
            req.on("end", () => {
              postData = JSON.parse(postData);

              switch (postData.task) {
                case "login":
                  let result = login(postData);
                  res.writeContinue; //向客户端发送100 Continue 响应，需要Expect: 100-continue头部
                  res.writeHead(200, {
                    "Content-Type": "application/json",
                    "Set-Cookie": [
                      `token=${result.token};SameSite=Strict;expires=${result.expiresMGT};Path=/;Secure;HttpOnly`,
                    ],
                  });
                  delete result.expiresMGT;
                  result = JSON.stringify(result);
                  res.write(result);
                  res.end();
                  break;
                case "register":
                  let result2 = register(postData);
                  res.writeContinue();
                  // delete result2.expiresMGT
                  result2 = JSON.stringify(result2);
                  res.write(result2);
                  res.end();

                  break;
                case "delete":
                  res.end("暂未开发");

                default:
                  res.end();
                  break;
              }
            });
            break;
          default:
            res.statusCode = 405;
            // res.setHeader("Content-type", "application/json")
            res.end("Method Not Allowed");
            break;
        }
        break;
      */
  }
}).listen(PORT, () => {
  console.log("web started https://127.0.0.1:", PORT);
});
