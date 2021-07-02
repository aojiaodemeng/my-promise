# 一、then 方法的多次调用

同一个 promise 对象中的 then 方法是可以被多次调用的，当 then 方法被多次调用时，每一个 then 方法中传递的回调函数都是要被执行的。

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
- successCallback = undefined
+ successCallback = [];
  // 失败回调
- failCallback = undefined
+ failCallback = [];

  // 把resolve和reject用箭头函数写，使this指向promise的实例对象
  resolve = (value) => {
    if (this.status !== PENDING) return;
    // 将状态更改为成功
    this.status = FULFILLED;
    // 保存成功之后的值
    this.value = value;
    // 判断成功回调是否存在，如果存在 调用
    // this.successCallback && this.successCallback(this.value)
+   while (this.successCallback.length) this.successCallback.shift()(this.value);
  };
  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    // this.failCallback && this.failCallback(this.reason);
+   while (this.failCallback.length) this.failCallback.shift()(this.reason);
  };
  then(successCallback, failCallback) {
    if (this.status === FULFILLED) {
      successCallback(this.value);
    } else if (this.status === REJECTED) {
      failCallback(this.reason);
    } else {
      // 等待
      // 将成功回调和失败回调存储
-     this.successCallback = successCallback
-     this.failCallback = failCallback
+     this.successCallback.push(successCallback);
+     this.failCallback.push(failCallback);
    }
  }
}

module.exports = MyPromise;

```
