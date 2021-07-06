# 一、简述

思路：需要在执行构造器以及执行回调函数时捕获错误。

# 二、在执行构造器捕获错误

```javascript
class MyPromise {
  constructor(executor) {
+   try {
      executor(this.resolve, this.reject);
+   } catch (e) {
+     this.reject(e);
+   }
  }
}
```

# 三、执行回调函数时捕获错误

```javascript
class MyPromise {
    resolve = (value) => {
        ...
-       while (this.successCallback.length) this.successCallback.shift()(this.value);
+       while (this.successCallback.length) this.successCallback.shift()();
    };
    reject = (value) => {
        ...
-       while (this.failCallback.length) this.failCallback.shift()(this.reason);
+       while (this.failCallback.length) this.failCallback.shift()();
    };
    then(successCallback, failCallback) {
        ...
        let promise2 = new MyPromise((resolve, reject) => {
        if (this.status === FULFILLED) {
            setTimeout(() => {
+              try {
                    let x = successCallback(this.value);
                    resolvePromise(promise2, x, resolve, reject);
+              } catch (e) {
+                  reject(e);
+              }
            }, 0);
        } else if (this.status === REJECTED) {
-           failCallback(this.reason)
+           setTimeout(() => {
+               try {
+                   let x = failCallback(this.reason);
+                   resolvePromise(promise2, x, resolve, reject);
+               } catch (e) {
+                   reject(e);
+               }
+           }, 0);
        } else {
            // 等待
            // 将成功回调和失败回调存储
-           this.successCallback.push(successCallback)
-           this.failCallback.push(failCallback)
+           this.successCallback.push(() => {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            });
+           this.failCallback.push(() => {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            });
        }
    });
    return promise2;
  }
}
```

# 四、完整的类 promise

```javascript
// myPromise.js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
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
    while (this.successCallback.length) this.successCallback.shift()();
  };
  reject = (reason) => {
    if (this.status !== PENDING) return;
    this.status = REJECTED;
    // 保存失败后的原因
    this.reason = reason;
    while (this.failCallback.length) this.failCallback.shift()();
  };
  then(successCallback, failCallback) {
    successCallback = successCallback ? successCallback : (value) => value;
    failCallback = failCallback
      ? failCallback
      : (reason) => {
          throw reason;
        };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 等待
        // 将成功回调和失败回调存储
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // 返回了自己
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
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
