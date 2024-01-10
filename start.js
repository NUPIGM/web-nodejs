import { createSecureServer } from "node:http2";
import { readFileSync } from "node:fs";
import os from "node:os";

import { server } from "./server.js";

//端口
// const PORT = process.env.PORT || 443 || 80;
(function () {
  const networkInterfaces = os.networkInterfaces();

  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaceInfo = networkInterfaces[interfaceName];

    // 过滤出非内部接口（排除回环接口）
    const nonInternalInterfaces = interfaceInfo.filter((iface) => {
      return (
        iface.internal === false ||
        (iface.internal === true && iface.family !== "IPv4")
      );
    });

    // 遍历IPv4地址并打印
    nonInternalInterfaces.forEach((iface) => {
      if (iface.family === "IPv4") {
        console.log(
          `Internal IP address of ${interfaceName}: ${iface.address}`
        );
      }
    });
  });
})();

//证书验证（测试证书）
let options = {
  key: readFileSync("./tls/key.pem"),
  cert: readFileSync("./tls/cert.pem"),
};

// 创建HTTP/2服务器
createSecureServer(options, (req, res) => {
  server(req, res);
}).listen(443, () => {
  console.log("web started for https://localhost", 443);
});
options = null;
