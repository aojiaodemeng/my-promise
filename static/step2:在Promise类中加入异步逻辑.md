# 实现思路
当在执行器中加入异步代码时，then方法也会立即执行，执行时会判断状态，此时肯定是Pending状态，此时不能立即调用successCallback或failCallback函数，此时应该将成功回调和失败回调存储起来，当异步代码执行完成之后，再去调用。

总结：执行器中有异步代码时，成功回调和失败回调会分别在resolve和reject中执行，否则是直接在then方法中执行。

```javascript
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
+   setTimeout(() => {
        // resolve('成功')
        reject('失败')
+   }, 2000)
    
})

promise.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})
```

```javascript
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise{
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    // promise状态
    status = PENDING
    // 成功之后的值
    value = undefined
    // 失败后的原因
    reason = undefined
    // 成功回调
+   successCallback = undefined
    // 失败回调
+   failCallback = undefined

    // 把resolve和reject用箭头函数写，使this指向promise的实例对象
    resolve = value => {
        if (this.status !== PENDING) return;
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存成功之后的值
        this.value = value
        // 判断成功回调是否存在，如果存在 调用
+       this.successCallback && this.successCallback(this.value)
    }
    reject = reason => {
        if (this.status !== PENDING) return;
        this.status = REJECTED
        // 保存失败后的原因
        this.reason = reason
+       this.failCallback && this.failCallback(this.reason)
    }
    then(successCallback, failCallback) {
        if (this.status === FULFILLED) {
            successCallback(this.value)
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        } else {
            // 等待
            // 将成功回调和失败回调存储
+           this.successCallback = successCallback
+           this.failCallback = failCallback
        }
    }
}

module.exports = MyPromise
```