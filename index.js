const MyPromise = require("./myPromise");
let promise = new MyPromise((resolve, reject) => {
  resolve("成功");
});

function other() {
  return new MyPromise((resolve, reject) => {
    resolve("other");
  });
}
promise
  .then((value) => {
    console.log(value);
    // return 100
    return other();
  })
  .then((value) => {
    console.log(value);
  });
