/**
 *
 * @description mime类型
 */
export const contentType = {
  ".html": "text/html;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".txt": "text/plain;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".ico": "image/x-icon;charset=utf-8",
  ".jpg": "image/jpg;charset=utf-8",
  ".jpeg": "image/jpeg;charset=utf-8",
  ".png": "image/png;charset=utf-8",
  ".gif": "image/gif;charset=utf-8",
  ".svg": "image/svg+xml;charset=utf-8",
  ".mpeg": "audio/mpeg",
  ".vorbis": "audio/vorbis",
  ".mpeg": "video/mpeg",
  ".mp4": "video/mp4",
  ".json": "application/json;charset=utf-8",
  ".xml": "application/xml;charset=utf-8",
  ".pdf": "application/pdf;charset=utf-8",
  ".zip": "application/zip;charset=utf-8",
  "":"none",
  // '':'application/octet-stream',
  // 添加更多MIME类型...
};

/**
 * 解析cookie头并将cookie头值解析为键值对对象
 * @param {string} cookieHeader - cookie头值
 * @returns {object} - 解析后的键值对对象
 */
export function parseCookies(cookieHeader) {
  if (cookieHeader) {
    return cookieHeader.split("; ").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      acc[name.trim()] = value;
      return acc;
    }, {});
  }
  return {};
}

/**
 *
 * @param {String} data
 * @returns {boolean}
 * @description 判断是否压缩
 */
export function gzipOn(data) {
  if (string) {
    if (/\bgzip\b/.test(data)) {
      return true;
    } else {
      return false;
    }
  }
}
