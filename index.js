const fs = require('fs');
const { DAW, Song, Sample } = require('./daw');
//import * as Daw from './daw';
//const { Song, Track, Sample } = require('./daw/builders');

// Create song
var song = DAW.Song({name: "Demo song 01"});
// process.exit();

// Create track
var t1 = DAW.Track();
var t2 = DAW.Track();
var m = DAW.Mixer({ tracks: [t1, t2]});

var s1 = DAW.Sample({
  length: 10
})

s1.set(0, 0, 0.1);
s1.set(0, 1, 0.2);
s1.set(0, 2, 0.3);
s1.set(1, 0, -0.1);
s1.set(1, 1, -0.2);
s1.set(1, 2, -0.3);

var p1 = t1.addPart(0, s1);
var p2 = t2.addPart(2, s1);

song.setInput(m);
DAW.Go();

// Sample.fromFile('./samples/bass.wav').then(bass => {
//   t1.addPart(0, bass);
//   song.setInput(t1);
//   DAW.Go();
// })


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

