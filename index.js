const MyPromise = require("./myPromise");
let promise = new MyPromise((resolve, reject) => {
  resolve("成功");
});

promise
  .then()
  .then()
  .then(
    (value) => {
      console.log(value);
    },
    (reason) => console.log(reason)
  );
