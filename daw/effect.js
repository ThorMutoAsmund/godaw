//
// DAW Effect
// (c) Thor Muto Asmund, 2018
//


// TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD 
// TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD 
// TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD 
// TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD TBD 

const { UID } = require ('./uid');
const { Song } = require ('./song');
const { Facade, FacadeDefinition, InputDefinition, OutputDefinition } = require ('./facade');

class Effect {
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
    this.numberOfChannels = numberOfChannels;

    this.level = options.level || 1.0;
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
    return new Promise(resolve => {
      const empty = this.numberOfChannels == 1 ? [0.0] : [0.0, 0.0]
      this.facade.setOutput(t => {
        return t < this.position || (this.length > 0 && t >= this.position + this.length) ?
          empty :
          this.facade.input.facade.output(t - this.position).map(v => v*this.level);
      });
      resolve();
    });
  }  
}

module.exports = { Effect };