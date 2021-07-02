# 一、实现简单的promise
1.promise就是一个类，在执行这个类的时候，需要传递一个回调函数执行器（称为执行器）进去，执行期会立即执行。这个回调函数有两个参数(resolve、reject)，这两个参数其实都是函数，调用它们可以更改promise的状态。

2.promise中有三种状态，分别为成功fulfilled、失败rejected、等待pending，一旦状态确定就不可更改。
 pending->fulfilled
 pending->rejected

3.resolve和reject函数是用来更改状态的。resolve把状态变为fulfilled，reject把状态变为rejected。
 
4.then方法内部做的事情就是判断状态。如果状态是成功，则调用成功的回调函数，否则调用失败的回调函数，then方法是被定义在原型对象中的。

5.then成功回调有一个参数，表示成功之后的值，失败回调有一个参数，表示失败之后的原因

```javascript
// myPromise.js
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

    // 把resolve和reject用箭头函数写，使this指向promise的实例对象
    resolve = value => {
        if (this.status !== PENDING) return;
        // 将状态更改为成功
        this.status = FULFILLED
        // 保存成功之后的值
        this.value = value
    }
    reject = reason => {
        if (this.status !== PENDING) return;
        this.status = REJECTED
        // 保存失败后的原因
        this.reason = reason
    }
    then(successCallback, failCallback) {
        if (this.status === FULFILLED) {
            successCallback(this.value)
        } else if (this.status === REJECTED) {
            failCallback(this.reason)
        }
    }
}

module.exports = MyPromise
```


调试代码：
```javascript
// index.js,终端用命令node index.js执行
const MyPromise = require('./myPromise')
let promise = new MyPromise((resolve, reject) => {
    // resolve('成功')
    reject('失败')
})

promise.then(value => {
    console.log(value)
}, reason => {
    console.log(reason)
})
```