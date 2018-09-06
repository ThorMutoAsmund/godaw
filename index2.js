const fs = require('fs');
const { sec }  = require('./daw/g');
const { G, DAW, Song, Sample } = require('./daw');

// Create song
var song = G.Song({name: "Demo song 01"});

// Create track
var t1 = G.Track();
var t2 = G.Track();
var m = G.Mixer({ tracks: [t1, t2]});

var sample = new Sample({file: './samples/speak.wav', numberOfChannels: 2});
t1.addPart(sec(0), sample);
//t1.addPart(sec(1), sample, {length: sec(0.5)});
//t1.addPart(sec(2), sample,  {level:0.25});
song.setInput(m);
DAW.Go();





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

