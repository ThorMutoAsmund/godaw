//
// DAW G
// (c) Thor Muto Asmund, 2018
//

const { Song } = require('./song');

class G {
  defaultSamplerate() {
    return 48000;
  }

  sec(s) {
    return Song.default.sampleRate * s;
  }
}

module.exports = new G();