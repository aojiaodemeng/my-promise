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
    resolve("p2 resolve");
  });
}

p2()
  .finally(() => {
    console.log("finally");
    return p1();
  })
  .then(
    (value) => {
      console.log("then:" + value);
    },
    (reason) => {
      console.log(reason);
    }
  );
