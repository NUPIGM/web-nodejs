import { createReadStream } from "node:fs";
import { extname, join } from "node:path";
import zlib from "node:zlib";

import { gzipOn, contentType, parseCookies } from "./my_modules/mudules.js";
import { logError } from "./my_modules/log.js";
import { Agent } from "node:http";
//import { login, register } from "./my_modules/admin.js";

export function server(req, res) {
  const {
    reqUrl,
    remoteAddress,
    localAddress,
    remotePort,
    localPort,
    getCookies,
    acceptEncoding,
    host,
    userAgent,
    AcceptLanguage,
    httpVersion,
    method,
  } = request(req);
  // 先判断请求的方法，决定处理过程
  // GET || POST
  switch (req.method) {
    case "GET": // 请求API，不同路径执行不同内容
      let arr = reqUrl.pathname.split("/");
      switch (arr[1]) {
        case "api":
          switch (reqUrl.pathname) {
            case "/api/login":
              res.end("Hello World!");
              break;
            case "/api/register":
              res.end("Hello World!");
              break;
            default:
              res.end("{msg: '404'}");
              break;
          }
          break;
        default:
          // 使用 path 模块处理请求路径，确保只能访问 public 文件夹下的内容
          const filePath = join(process.cwd(), "public", reqUrl.pathname);

          //访问文件的MIME类型
          const fileExt = extname(filePath);
          console.log(fileExt);
          const conType = contentType[fileExt];
          try {
            //读取文件流
            const readStream = createReadStream(filePath, {
              highWaterMark: 64,
            });

            readStream.on("data", (chunk) => {
              if (!res.headersSent) {
                res.writeHead(200, {
                  "Content-Type": conType,
                });
              }
              res.write(chunk);
            });
            readStream.on("error", (err) => {
              res.writeHead(404);
              res.end();
              readStream.close();
              logError(err, remoteAddress);
            });
            readStream.on("end", () => {
              res.end();
              readStream.close();
            });
          } catch (e) {}

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
}
function request(req) {
  // const reqUrl = new URL(decodeURIComponent(req.url),req.headers["host"]);

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const remoteAddress = req.socket.remoteAddress;
  const localAddress = req.socket.localAddress;
  const remotePort = req.socket.remotePort;
  const localPort = req.socket.localPort;
  const cookies = req.headers.cookie || "";
  const getCookies = parseCookies(cookies);
  const acceptEncoding = req.headers["accept-encoding"];
  const host = req.headers["host"];
  const userAgent = req.headers["user-Agent"];
  const AcceptLanguage = req.headers["Accept-Language"];
  const httpVersion = req.httpVersion;
  const method = req.method;

  return {
    reqUrl,
    remoteAddress,
    localAddress,
    remotePort,
    localPort,
    getCookies,
    acceptEncoding,
    host,
    userAgent,
    AcceptLanguage,
    httpVersion,
    method,
  };
}
