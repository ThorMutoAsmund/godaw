
const fs = require('fs');

import * as Daw from './daw';
import { Song, Track, Sample } from './daw/builders';

// Create song
Song({name: "Demo song 01"});

// process.exit();


// Create track
var t = Track();

var s1 = Sample({
  length: 10
})

s1.set(0, 0, 1.0);
s1.set(0, 1, 1.1);
s1.set(0, 2, 1.2);
s1.set(1, 0, -1.0);
s1.set(1, 1, -1.1);
s1.set(1, 2, -1.2);

var p1 = t.addPart(s1, 0);
var p2 = t.addPart(s1, 2);

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

Daw.Song.default.render(0,10);
