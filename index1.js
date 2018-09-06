const fs = require('fs');
const { sec }  = require('./daw/g');
const { G, DAW, Song, Sample } = require('./daw');

// Create song
var song = G.Song({name: "Demo song 01"});

// Create track
var t1 = G.Track();
var t2 = G.Track();
var m = G.Mixer({ tracks: [t1, t2]});

var s1 = G.Sample({
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
