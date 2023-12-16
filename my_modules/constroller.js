const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".txt": "text/plain",
  ".js": "text/javascript",
  ".ico": "image/x-icon",
  ".jpg": "image/jpg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mpeg": "audio/mpeg",
  ".vorbis": "audio/vorbis",
  ".mpeg": "video/mpeg",
  ".mp4": "video/mp4",
  ".json": "application/json",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  // '':'application/octet-stream',
  // 添加更多MIME类型...
};

function reqAndRes(request, response) {}

function parseCookie(string) {
  let obj = {};
  if (!string) {
    return obj;
  }
  try {
    string.split(";").forEach((item) => {
      const arr = item.split("=");
      const key = arr[0].trim();
      const val = arr[1].trim();
      obj[key] = val;
    });
  } catch (error) {
    console.log(error);
  }
  // let json = JSON.stringify(obj);
  // console.log(obj); // 输出 '{"a":"1","b":"2","c":"3"}'
  return obj;
}
function returnData() {}
function doPublicFiles() {}
function gzipOn(string) {
  if (string) {
    if (/\bgzip\b/.test(string)) {
      return true;
    } else {
      return false;
    }
  }
}

export { mimeTypes, reqAndRes, returnData, doPublicFiles, parseCookie, gzipOn };
