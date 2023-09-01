
function parseCookie(string) {
    let obj = {};
    if (!string) {
        return obj;
    }
    string.split(";").forEach(item => {
        const arr = item.split("=");
        const key = arr[0].trim();
        const val = arr[1].trim();
        obj[key] = val;
    });
    // let json = JSON.stringify(obj);
    // console.log(obj); // 输出 '{"a":"1","b":"2","c":"3"}'
    return obj;
}
function returnData() {

}
function doPublicFiles() {
    
}


export { returnData, doPublicFiles,parseCookie }