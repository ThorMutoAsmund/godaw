//
// DAW Dummy
// (c) Thor Muto Asmund, 2018
//

const { UID } = require('./uid');
const { Song } = require('./song');
const { Facade, FacadeDefinition, OutputDefinition } = require('./facade');

class Dummy {
  constructor() {
    this.uid = UID.getUID();
    this.song = Song.default;

    // Set up facade
    const facadeDefinition = new FacadeDefinition({
      outputs: [
        new OutputDefinition({
          numberOfChannels: 1
        })
      ]
    });
    this.facade = new Facade(facadeDefinition);
  }

  prepare(start, length) {
    this.facade.setOutput(() => 0);
  }
}

module.exports = { Dummy };