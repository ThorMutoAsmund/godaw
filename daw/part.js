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
    this.defineFacade({
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

    this.position = position;
    this.numberOfChannels = numberOfChannels;

    this.level = options.level || 1.0;
    this.length = options.length || 0.0;
  }

  static create(position, object, options) {
    if (!object) {
      throw 'Cannot create part without an object';
    }

    const part = new Part(position, object.numberOfChannels, options);
    part.setInput(object);
    
    return part;
  }

  prepare(start, length) {
    return new Promise(resolve => {
      const empty = this.numberOfChannels == 1 ? [0.0] : [0.0, 0.0]
      this.setOutput(t => {
        return t < this.position || (this.length > 0 && t >= this.position + this.length) ?
          empty :
          this.getInput().getOutput()(t - this.position).map(v => v*this.level);
      });
      resolve();
    });
  }  
}

// Mixin
Facade.assignTo(Part);


module.exports = { Part };