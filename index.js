const MyPromise = require("./myPromise");
let promise = new MyPromise((resolve, reject) => {
  resolve("成功");
});

function other() {
  return new MyPromise((resolve, reject) => {
    resolve("other");
  });
}
let p1 = promise.then((value) => {
  console.log(value);
  // return 100
  // return other();
  return p1;
});

p1.then(
  (value) => {
    console.log(value);
  },
  (reason) => {
    console.log(reason);
  }
);
