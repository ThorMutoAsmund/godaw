
const fs = require('fs');

import { Log, Song, Track, Sample, FunctionGenerator } from './daw';

var t3 = new Track();

// Create song
Song.create({name: "Demo song 01"});

// process.exit();


// Create track
var t = Track.create({
});

var t2 = Track.create({
});

Song.default.addTrack(t3);

var s1 = Sample.create({
  size: 10
})
s1.set(0, 0, 1.0);
s1.set(0, 1, 1.1);

var p1 = t.addPart(s1, 0);
var p2 = t.addPart(s1, 2);

var s2 = Sample.create({
  size: 10
})
s2.set(0, 2, 1.2);
s2.set(0, 3, 1.3);

var p3 = t.addPart(s2, 4);



// const samplesDir = 'samples';
// var pos = 0.0;
// var promises = [];
// fs.readdirSync('samples').slice(0,1).forEach(fileName => {
//   promises.push(Sample.fromFile(`${samplesDir}/${fileName}`).then(sample => {
//     t.add(sample, pos);
//     pos += 1.0;
//   }))
// })

// // Add sine after one second
// t.add(FunctionGenerator.create({
//   func: (t) => sin(t)*1000  
// }), pos);

// Promise.all(promises).then(() => {
//   // Render song
//   const output = Song.default.render(0, 1000);
//   console.log('output', output);
// }).catch(err => {
//   Log.err(err);
// })

Song.default.render(0,200);




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