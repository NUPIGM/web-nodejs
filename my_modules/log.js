import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { format } from "node:util";

// 确保日志目录存在
if (!existsSync("log")) {
  mkdirSync("log", { recursive: true });
}
// 创建写入流并设置为追加模式
/**
 * @param {object} msg  错误信息
 * @param {string} ip   IP地址
 * @returns {null}      无返回值
 */
export function logError(msg, ip = "0.0.0.0") {
  let ret = "";
  if (!msg) {
    return ret;
  }
  let date = new Date();
  let time = date.toISOString().replace("T", " ").replace(/\..+/, "");
  if (msg instanceof Error) {
    ret = format(
      "<%s> [%s]\n  stack = %s\n  data = %s\n",
      time,
      ip,
      msg.stack,
      JSON.stringify(msg.data)
    );
  } else {
    ret = format("<%s> [%s]\n  %s\n", time, ip, msg);
  }
  const logFilePath = "log/error.log";
  const logFileStream = createWriteStream(logFilePath, { flags: "a" });
  logFileStream.write(ret);
  logFileStream.close();
}
