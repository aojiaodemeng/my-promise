const MyPromise = require("./myPromise");

function p1() {
  return new MyPromise(function (resolve, reject) {
    setTimeout(function () {
      resolve("p1");
    }, 2000);
  });
}
function p2() {
  return new MyPromise(function (resolve, reject) {
    resolve("p2");
  });
}

MyPromise.resolve("100").then((result) => console.log(result));
MyPromise.resolve(p2()).then((result) => console.log(result));
