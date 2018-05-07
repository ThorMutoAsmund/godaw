
const fs = require('fs');

import { Log, Song, Track, Sample, FunctionGenerator } from './daw';

// Create song
Song.create("Demo song 01");

// process.exit();


// Create track
var t = Track.create({
  isOutput: true
});

const samplesDir = 'samples';
var pos = 0.0;
var promises = [];
fs.readdirSync('samples').slice(0,1).forEach(fileName => {
  promises.push(Sample.fromFile(`${samplesDir}/${fileName}`).then(sample => {
    t.add(sample, pos);
    pos += 1.0;
  }))
})

// Add sine after one second
t.add(FunctionGenerator.create({
  func: (t) => sin(t)*1000  
}), pos);

Promise.all(promises).then(() => {
  // Render song
  const output = Song.default.render(0, 1000);
  console.log('output', output);
}).catch(err => {
  Log.err(err);
})






// var bufSize = 1000000;

// console.time('Alloc');
// var buf = new Float32Array(bufSize);
// console.timeEnd('Alloc');
// console.log(`Buffer length: ${buf.length}`)

// console.time('Fill');
// for (var x=0; x < buf.length; ++x) {
//   buf[x] = x;
// }
// console.timeEnd('Fill');

// console.log(buf[10]);