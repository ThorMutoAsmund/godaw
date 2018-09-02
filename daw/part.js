//
// DAW Part
// (c) Thor Muto Asmund, 2018
//

const { UID } = require ('./uid');
const { Song } = require ('./song');
const { Facade, FacadeDefinition, InputDefinition, OutputDefinition } = require ('./facade');

class Part {
  constructor(position, numberOfChannels, options = {}) {
    this.uid = UID.getUID();
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

  static create(position, object, options) {
    if (!object) {
      throw 'Cannot create part without an object';
    }

    const part = new Part(position, object.numberOfChannels, options);
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
}

module.exports = { Part };