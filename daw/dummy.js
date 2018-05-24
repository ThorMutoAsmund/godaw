//
// DAW Dummy
// (c) Thor Muto Asmund, 2018
//

import { Song, Facade, FacadeDefinition, OutputDefinition } from './';

export class Dummy {
  constructor() {
    this.uid = Song.getUID();
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

  static create() {
    return new Dummy();
  }

  prepare(start, length) {
    this.facade.setOutput(() => 0);
  }
  
  render(start, chunkSize) {
  }
}