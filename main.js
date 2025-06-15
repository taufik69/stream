// // ১. events মডিউল ইমপোর্ট
// const EventEmitter = require("events");

// // ২. EventEmitter অবজেক্ট তৈরি
// const myEmitter = new EventEmitter();

// // ৩. ইভেন্টের জন্য লিসেনার সেট
// myEmitter.on("greet", (name) => {
//   console.log(`Hello, ${name}!`);
// });

// // ৪. ইভেন্ট ট্রিগার (emit)
// myEmitter.emit("greet", "Taufik");

// const event = require("events");
// const eventEmiter = new event();

// // now define a lishener for hearing the event
// eventEmiter.on("hi", (prop) => {
//   console.log("hi men how are you", prop);
// });

// eventEmiter.emit("hi", { name: "prop" });

const { log } = require("console");

const http = require("http");
const event = require("events");
const fs = require("fs");
const path = require("path");
const { ChildProcess } = require("child_process");
const { json } = require("stream/consumers");
const eventEmiter = new event();

eventEmiter.on("fire", async (callback) => {
  const response = await fetch("https://dummyjson.com/products");
  const data = await response.json();
  callback(data);
});

const server = http.createServer((req, res) => {
  const pathname = path.join(__dirname, "data.txt");

  // if (fs.existsSync(pathname)) {
  //   res.end("already file Available");
  // }
  // // write data
  // eventEmiter.emit("fire", (data) => {
  //   fs.writeFile("data.txt", JSON.stringify(data), (err) => {
  //     if (err) {
  //       console.log("error from ", err);
  //     } else {
  //       console.log("file created Done");
  //     }
  //   });
  // });

  // routes
  const routes = req.url.replace("/", "").toLocaleLowerCase();
  if (routes == "getdata".toLocaleLowerCase()) {
    //  grab a data then send it
    // fs.readFile(pathname, "utf-8", (err, data) => {
    //   if (err) {
    //     log(err);
    //   } else {
    //     log("data is :", data);
    //     res.end("done " + data);
    //   }
    // });

    // usigng chunk or straming

    let data = "";
    const stream = fs.createReadStream(pathname);
    const writeStream = fs.createWriteStream("xyz.txt");

    stream.pipe(writeStream);
    // stream.on("data", (chunk) => {
    //   writeStream.write(chunk);
    //   data += chunk.toString();
    // });
    stream.on("end", () => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    });
    stream.on("error", (err) => {
      res.writeHead(500);
      res.end("File read error");
    });

    //
  }
  if (routes == "writeData".toLocaleLowerCase() && req.method == "POST") {
    const writeStream = fs.createWriteStream("output.txt");
    req.on("data", (chunk) => {
      writeStream.write(chunk);
    });

    req.on("end", () => {
      writeStream.end();
      res.end("File write done");
    });
  }
});

server.listen(4000, () => {
  log("server Runnign on http://localhost:4000");
});
