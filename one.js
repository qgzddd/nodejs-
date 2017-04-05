let http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

let staticPath = "./res/";


let app = http.createServer((request, response) => {
    let pathName = url.parse(request.url).pathname,
        realPath = path.join(staticPath, pathName); // 请求文件的在磁盘中的真实地址
//对于文件的后缀名，可以通过 path.extname 方法来获取。由于 path.extname 返回值中包含 . 。所以应除掉”.”。
let extName = path.extname(realPath);
extName = extName ? extName.slice(1) : "";
let MIME = require("./MIME.js").type;

// ...
let contentType = MIME[extName] || "text/plain";


    fs.exists(realPath, (exists) => {
        if(!exists) {
            // 当文件不存在时
           response.writeHead(200, {"Content-Type": contentType});

            response.write("This request URL ' " + realPath + " ' was not found on this server.");
            response.end();
        } else {
            // 当文件存在时
            fs.readFile(realPath, "binary", (err, file) => {
                if (err) {
                    // 文件读取出错
                    response.writeHead(500, {"Content-Type": "text/plain"});

                    response.end(err);
                } else {
                    // 当文件可被读取时，输出文本流
                  response.writeHead(200, {"Content-Type": contentType});
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});

app.listen(80, "127.0.0.1");