# 一、实现思路

先判断传入的参数是否是 promise 对象，如果是 promise 对象，就直接返回，如果不是，就创建一个 promise 对象，把给定的值包裹在这个创建的 promise 对象中，然后返回这个 promise 对象。

```javascript
static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
}
```
