const MyPromise = require("./myPromise");
let promise = new MyPromise((resolve, reject) => {
  // throw new Error("execu");
  resolve("成功");
});

promise
  .then()
  .then()
  .then((value) => {
    console.log("then2", value);
  });
