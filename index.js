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