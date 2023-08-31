// 假设我们有一个URL
let url = new URL("http://example.com/?product=shirt&color=blue&newuser&size=m");

// 我们可以使用searchParams来获取查询参数
let searchParams = url.searchParams;

// 输出所有的查询参数
for(let param of searchParams) {
  console.log(param);
}

// 获取特定的查询参数
let product = searchParams.get('product'); // "shirt"
let color = searchParams.get('color'); // "blue"
let newUser = searchParams.get('newuser'); // "" (存在，但没有值)
let size = searchParams.get('size'); // "m"

// 检查是否存在特定的查询参数
let hasColor = searchParams.has('color'); // true
let hasPrice = searchParams.has('price'); // false

// 修改查询参数
searchParams.set('product', 'pants'); // 将产品改为裤子
searchParams.delete('newuser'); // 删除newuser参数

// 将修改后的查询参数添加回URL
url.search = searchParams.toString();

console.log(url.toString()); // "http://example.com/?product=pants&color=blue&size=m"