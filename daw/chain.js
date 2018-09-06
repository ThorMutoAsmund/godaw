
function getPromise(timeout) {
  return new Promise(resolve => {
    console.log('starting wait ' + timeout);
    setTimeout(() => {
      console.log('waited ' + timeout + ' ms');
      resolve();
    }, timeout);
  });
}

/*
const tasks = getTaskArray();
return tasks.reduce((promiseChain, currentTask) => {
    return promiseChain.then(chainResults =>
        currentTask.then(currentResult =>
            [ ...chainResults, currentResult ]
        )
    );
}, Promise.resolve([])).then(arrayOfResults => {
    // Do something with all results
});
*/

var all = [getPromise(3000), getPromise(2000), getPromise(1000)];

// all.reduce((chain, current) => {
//   return chain.then(() => 
//     current.then(() => []));
// }, Promise.resolve([])).then(() => {
//   console.log('done');
// })

all[0].then(() => {
  console.log('done');
})


// all[0].then(all[1]).then(all[2]).then(() => {
//      console.log('done');
//    })

// all.reduce((chain, current) => {
//   return chain.then(current);
// }, Promise.resolve()).then(() => {
//   console.log('done');
// })