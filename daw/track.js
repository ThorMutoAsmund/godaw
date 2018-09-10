//
// DAW Track
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

const { getUID } = require('./helpers/uid');
const { Song } = require('./song');
const { Facade, FacadeDefinition, OutputDefinition } = require('./helpers/facade');
const { Mix } = require('./helpers/mix');
const { Part } = require('./part');

class Track extends Facade(Mix(Object)) {
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
  }

  get numberOfChannels() {
    return this._numberOfChannels;
  }
  
  addPart(position, object, options = {}) {
    const part = Part.create(position, object, options);
    this.addInput(part);

    return part;
  }

  prepare(start, length) {
    return this.mix(start, length)
  }
}

module.exports = { Track };