(function (window) {
  const PENDING = 'pending'
  const RESOLVE = 'resolve'
  const REJECT = 'reject'

  function Promise(excutor) {
    const _this = this
    _this.status = PENDING
    _this.data = ''
    _this.callBacks = []

    function resolve(value) {
      if (_this.status !== PENDING) {
        return
      }
      _this.status = RESOLVE
      _this.data = value
      if (_this.callBacks.length > 0) {
        setTimeout(() => {
          _this.callBacks.forEach(calbacksObj => {
            calbacksObj.onResolved(value)
          });
        });
      }

    }

    function reject(reason) {
      if (_this.status !== PENDING) {
        return
      }
      _this.status = REJECT
      _this.data = reason
      if (_this.callBacks.length > 0) {
        setTimeout(() => {
          _this.callBacks.forEach(callbacksObj => {
            callbacksObj.onRejected(reason)
          })
        });
      }

    }
    try {
      excutor(resolve, reject)
    } catch (error) {
      reject(error);
    }

  }
  Promise.prototype.then = function (onResolved, onRejected) {
    let _this = this
    //返回一个新的promise的对象
    return new Promise((resolve, reject) => {
      function handle(callback) {
        /* 
         1. 如果抛出异常, return的promise就会失败, reason就是error
         2. 如果回调函数返回不是promise, return的promise就会成功, value就是返回的值
         3. 如果回调函数返回是promise, return的promise结果就是这个promise的结果      
          */
        try {
          const result = callback(_this.data)
          if (result instanceof Promise) {
            // 3. 如果回调函数返回是promise, return的promise结果就是这个promise的结果      
            result.then(
              value => resolve(value),
              resason => reject(reason)
            )
          } else {
            //2. 如果回调函数返回不是promise, return的promise就会成功, value就是返回的值
            reject(result)
          }

        } catch (error) {
          //  1. 如果抛出异常, return的promise就会失败, reason就是error
          reject(error)
        }
      }
      if (_this.status === PENDING) {
        _this.callBacks.push({
          onResolved() {
            handle(onResolved)
          },
          onRejected() {
            handle(onRejected)
          }
        })

      } else if (_this.status === RESOLVE) {
        setTimeout(() => {
          handle(onResolved)
        });
      } else {
        setTimeout(() => {
          handle(onRejected)
        });

      }
    })

  }
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)

  }
  Promise.resolve = function (value) {

  }
  Promise.reject = function (reason) {

  }
  Promise.all = function (promises) {

  }
  Promise.race = function (promises) {

  }
  window.Promise = Promise
})(window)