const MyPromise = require("./myPromise");
let promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // resolve('成功')
    reject("失败");
  }, 2000);
});

promise.then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason);
  }
);
