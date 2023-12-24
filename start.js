import { createSecureServer } from "node:http2";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import os from "node:os";

import {server} from "./server.js";

//端口
// const PORT = process.env.PORT || 443 || 80;

// 获取所有网络接口信息
const networkInterfaces = os.networkInterfaces();
// 遍历网络接口信息
function getNetworkInterfaces() {
  for (let interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName];

    // 过滤出内部接口（不包括回环接口）
    if (interfaceInfo.internal !== true) {
      for (let addressInfo of interfaceInfo) {
        // 过滤出IPv4地址
        if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          console.log(
            `Internal IP address of ${interfaceName}: https://${addressInfo.address}`
          );
        }
      }
    }
  }
}
getNetworkInterfaces();

//证书验证（测试证书）
const options = {
  key: readFileSync("./ssl/key.pem"),
  cert: readFileSync("./ssl/cert.pem"),
};

// 创建HTTP/2服务器
createSecureServer(options, (req, res) => {
  server(req, res);
}).listen(443, () => {
  console.log("web started for https", 443);
});

// 创建HTTP服务器
createServer((req, res) => {
  server(req, res);
}).listen(80, () => {
  console.log("web started for http", 80);
});
