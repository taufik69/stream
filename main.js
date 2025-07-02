const http = require("http");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

// test for remote

const port = 4000;

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    // serve the static file
    const htmlPath = path.join(__dirname, "public", "index.html");
    // fs.createReadStream(htmlPath).pipe(res);

    const readStream = fs.createReadStream(htmlPath);
    let data = "";
    readStream.on("data", (chunk) => {
      data += chunk;
    });

    // when end straming
    readStream.on("end", () => {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(data);
    });
  } else if (req.url == "/vedio") {
    const vedioPath = path.join(__dirname, "vedios", "dash3.mov");
    const vedioStatus = fs.statSync(vedioPath);
    const fileSize = vedioStatus.size;
    const range = req.headers.range;
    if (!range) {
      return res.end("Range header required for video streaming");
    }
    const parts = range.replace("bytes=", "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    //  now streaming
    const stream = fs.createReadStream(vedioPath, { start, end });
    // time duration ta slowly slowly incrase hobe
    res.writeHead(206, {
      "content-type": "vedio/mp4",
      "content-range": `bytes ${start}-${end}/${fileSize}`,
      "accept-ranges": "bytes",
      "content-length": chunkSize,
    });

    // stream.on("data", (chunk) => {
    //   res.end(chunk);
    // });

    stream.pipe(res);
  }
});

// this is manual starting system . 
server.listen(port, () => {
  log(`http://localhost:${port}`);
});

// write some thing 
