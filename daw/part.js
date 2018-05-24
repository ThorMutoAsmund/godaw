//
// DAW Part
// (c) Thor Muto Asmund, 2018
//

import { Song, Facade, FacadeDefinition, InputDefinition, OutputDefinition } from './';

export class Part {
  constructor(numberOfChannels, position = 0, options = {}) {
    this.uid = Song.getUID();
    this.song = Song.default;

    // Set up facade
    const facadeDefinition = new FacadeDefinition({
      inputs: [
        new InputDefinition({
          name: 'Main'
        })
      ],
      outputs: [
        new OutputDefinition({
          numberOfChannels
        })
      ]
    });
    this.facade = new Facade(facadeDefinition);

    this.position = position;

    this.level = options.level || 1.0;
    this.offset = options.offset || 0.0;
    this.length = options.length || 0.0;
  }

  static create(object, position, options) {
    if (!object) {
      throw 'Cannot create part without an object';
    }

    const part = new Part(object.numberOfChannels, position, options);
    part.facade.setInput(object);

    return part;
  }

  prepare(start, length) {
    const empty = this.facade.input.facade.output.numberOfChannels == 1 ? [0.0] : [0.0, 0.0];
    this.facade.setOutput(t => {
      return t < this.position ?
           empty :        
        this.facade.input.facade.output(t - this.position).map(v => v*this.level + this.offset);
    });
  }  

  render(start, chunkSize) {
  }
}