// This example shows a song with a mixer and two tracks
// First track is a stereo sample pitched down
// Second track is a "midi" song played with an instrument and some nodes

const { DAW, Song, Mixer, Track, Sampler, Instrument, Player } = require('godaw')

// Song and mixer
var song = Song('Demo 01', {
  sampleRate: 44100
});
var mixer = Mixer();
song.output = mixer;

// Track 1
var t1 = Track({mixer, channels: 2});
var s1 = Sampler('samples/rhythm01.wav');
s1.pitchDown(DAW.st(12));  // 12 semitones
t1.add(0, s1);

// Track 2
var t2 = Track({mixer, channels: 1});
var sine = Instrument({
  channels: 1,
  gen: (evt) => {
    return Math.sin(evt.t * song.sampleRate);
  }
})
var mp = Player();
mp.addInstr(sine);
mp.addInput([
  {
    bpm: 120,
    instr: 0,
    time: 0,
    i: 'C4DE-D-CDE-D-FGH-FGH-HAHGF-D-HAHGF-D-C-G3-C4---C-G3-C4---'
  }
]);
t2.add(0, mp);




