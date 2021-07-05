# 本章概述

promise 是可以被链式调用的，且后面 then 方法的回调函数拿到的值实际上是上一个 then 方法回调函数的返回值。

本章我们主要实现下面两个功能：

1.实现链式调用。
实现思路：在 MyPromise 的 then 方法中返回一个新的 promise 对象

2.上一个 then 方法的回调函数返回的值（有两种：普通值、promise 对象）传递给下一个 then 方法的回调函数。
实现思路：在 then 方法的回调函数中可以返回普通值，也可以返回 promise 对象，如果返回的是普通值，可以直接调用 resolve 方法传递给下一个 promise 对象；如果返回的是一个 promise 对象，需要先查看返回的 promise 对象的状态，如果是成功则调用 resolve 方法把成功的状态传递给下一个 promise 对象，失败状态的话雷同。

```javascript
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }
  // promise状态
  status = PENDING;
  // 成功之后的值
  value = undefined;
  // 失败后的原因
  reason = undefined;
  // 成功回调
  successCallback = [];
  // 失败回调
  failCallback = [];

  // 把resolve和reject用箭头函数写，使this指向promise的实例对象
  resolve = (value) => {
    if (this.status !== PENDING) return;
    // 将状态更改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在，如果存在 调用
    // this.successCallback && this.successCallback(this.value)
    while (this.successCallback.length)
      this.successCallback.shift()(this.value);
  };
  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // this.failCallback && this.failCallback(this.reason);
    while (this.failCallback.length) this.failCallback.shift()(this.reason);
  };
  then(successCallback, failCallback) {
+   let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
-       successCallback(this.value)
+       let x = successCallback(this.value);
        // 判断x的值是普通值还是promise对象
        // 如果是普通值，直接调用resolve
        // 如果是promise对象，查看promise对象返回的结果
        // 再根据promise对象返回的结果决定调用resolve还是reject
+       resolvePromise(x, resolve, reject);
-       resolve(x)
      } else if (this.status === REJECTED) {
        failCallback(this.reason);
      } else {
        // 等待
        // 将成功回调和失败回调存储
        this.successCallback.push(successCallback);
        this.failCallback.push(failCallback);
      }
    });
+   return promise2;
  }
}

// 新增resolvePromise
function resolvePromise(x, resolve, reject) {
  if (x instanceof MyPromise) {
    // 下面两种方法均可
    // x.then(
    //   (value) => resolve(value),
    //   (reason) => reject(reason)
    // );
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}
module.exports = MyPromise;
```

```javascript
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
    // 此处返回普通值100或一个promise对象
    // return 100
    return other();
  })
  .then((value) => {
    // 如果上一个是返回的100，这里就会打印出100，如果是返回other()，则打印出other
    console.log(value);
  });
```
