
const fs = require('fs');

import { Song, Track, Sample, FunctionGenerator, IAudio } from './daw';

// Create song
Song.create("Demo song 01");

// Create track
var t = Track.create();

const samplesDir = 'samples';
var pos = 0.0;
fs.readdirSync('samples').slice(0,1).forEach(fileName => {
  t.add(pos, Sample.fromFile(`${samplesDir}/${fileName}` 
  ));
  pos += 1.0;
})

// Add sine after one second
t.add(pos, FunctionGenerator.create({
  func: (t) => sin(t)*1000 
}));






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