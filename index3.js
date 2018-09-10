const fs = require('fs');
const { sec }  = require('./daw/g');
const { DAW, Song, Sample } = require('./daw');

// Create song
var song = DAW.Song({name: "Demo song 03"});

// Create track
var t1 = DAW.Track();
var t2 = DAW.Track();
var m = DAW.Mixer({ tracks: [t1, t2]});

function nop(t, input) {
  return input.getOutput()(t);
}

function tremolo(t, input, options) {
  return input.getOutput()(t).map(s => s * Math.sin(t *2 * Math.PI / options.speed));
}

function reverse(t, input, options) {
  if (!input.length) {
    return input.numberOfChannels == 2 ? [0.0, 0.0] : [0.0];
  }

  return input.getOutput()(input.length - t - 1);  
}

var sample = DAW.Sample({file: './samples/speak.wav', numberOfChannels: 2});
var fxSample = DAW.Effect(nop, sample);
var fxSample2 = DAW.Effect(nop, fxSample, { speed: sec(0.5) });
var fxSample3 = DAW.Effect(nop, fxSample2, { speed: sec(0.5) });
t1.addPart(sec(0), fxSample3);
song.setInput(m);
DAW.Go();


