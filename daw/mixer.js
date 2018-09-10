//
// DAW Mixer
// (c) Thor Muto Asmund, 2018
//

const { getUID } = require('./helpers/uid');
const { Facade, OutputDefinition } = require('./helpers/facade');
const { Mix } = require('./helpers/mix');
const { Song } = require('./song');

class Mixer extends Facade(Mix(Object)) {
  constructor(options = {}) {
    super();

    this.uid = getUID();
    this.song = Song.default;

    this._numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
        throw 'Invalid number of channels';
    }

    // Set up facade
    this.defineFacade({
      hasMultipleInputs: true,
      outputs: [
        new OutputDefinition({
          numberOfChannels: this.numberOfChannels
        })
      ]
    });

    // Define tracks
    if (options.tracks) {
      options.tracks.forEach(track => {
        this.addInput(track);
      });
    }
  }

  get numberOfChannels() {
    return this._numberOfChannels;
  }

  prepare(start, length) {
    return this.mix(start, length)
  }
}

module.exports = { Mixer };