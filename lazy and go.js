const fs = require('fs');

var Promise = require('promise')
, nextTick = (typeof process !== 'undefined' && typeof process.nextTick === 'function')
    ? process.nextTick
    : require('next-tick')

function LazyPromise(fn) {
  if (!(this instanceof LazyPromise))
    return new LazyPromise(fn)
  if (typeof fn !== 'function')
    throw new TypeError('fn is not a function')

  var promise = null
  this.then = function(onResolved, onRejected) {
    if (promise === null) createPromise()
    return promise.then(onResolved, onRejected)
  }

  function createPromise() {
    promise = new Promise(function(resolve, reject) {
      nextTick(function() {
        fn(resolve, reject)
      })
    })
  }
}


// class LazyPromise {
//   constructor(fn) {
//     if (typeof fn !== 'function') {
//       throw new TypeError('fn is not a function');
//     }
//     this.fn = fn;
//   }

//   then(onResolved, onRejected) {
//     if (this.promise === null)  {
//       this.createPromise();
//     }
//     return this.promise.then(onResolved, onRejected);
//   }

//   createPromise() {
//     this.promise = new Promise(function(resolve, reject) {
//       process.nextTick(function() {
//         this.fn(resolve, reject)
//       })
//     })
//   }
// }

class Sample
{
  constructor(path) {
    this.data = new LazyPromise()
  }

  get(idx) {
    return this.data.next(sample => {
      sample[idx];
    })
  }
}

class DAW
{
  static Sample(path) {
    return new Promise((resolve, reject) => {
      try{
        fs.readFile(path, (err, data) => {
          resolve(data);
        });
      }
      catch(e) {
        reject(e);
      }
    })
  }

  static Init(prerequisites) {
    return Promise.all(prerequisites);
  }

  static Go(options = {}) {
    this.options = Object.assign({
      args: process.argv.slice(2), 
      mode: 'null',
      from: 0,
      to: -1}, options);
    
    var firstArg = true, key = null;
    this.options.args.forEach(arg => {
      if (firstArg) {
        this.options.mode = arg;
        firstArg = false;        
      }
      else if (key === null) {
        if (!arg.startsWith('--')) {
          throw new TypeError('Argument error: ' +  arg);
        }
        key = arg.substring(2);
      }
      else {
        this.options[key] = arg;
        key = null;
      }
    })

    console.log(this.options);
  }
}

var sample001;
DAW.Sample('./sample001.wav').then(data => {
  sample001 = data;

  console.log(sample001);
})

DAW.Go();

// DAW.Init([

// ]).then(() => {

// })

// Samples are promises
// Caching possible
// should be able to start x seconds into song

// npm run play
// or
// node index.js play



USE AUDIOBUFFER internally??