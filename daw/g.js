//
// DAW G
// (c) Thor Muto Asmund, 2018
//

const { Song } = require('./song');
const { Track } = require('./track');
const { Mixer } = require('./mixer');
const { Sample } = require('./sample');

class G {
  Song(options = {}) {
    var song = new Song(options);
    return song;
  }

  Track(options = {}) {
    const track = new Track(options);
    return track;
  }

  Mixer(options = {}) {
    const mixer = new Mixer(options);
    return mixer;
  }

  Sample(options = {}) {
    const sample = new Sample(options);
    return sample;
  }

  sec(s) {
    return Song.default.sampleRate * s;
  }

}

module.exports = new G();