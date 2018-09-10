//
// DAW Part
// (c) Thor Muto Asmund, 2018
//

const { getUID } = require('./helpers/uid');
const { Song } = require ('./song');
const { Facade, FacadeDefinition, InputDefinition, OutputDefinition } = require ('./helpers/facade');

class Part extends Facade(Object) {
  constructor(position, numberOfChannels, options = {}) {
    super();

    this.uid = getUID();
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
    this._numberOfChannels = numberOfChannels;

    this.level = options.level || 1.0;
    this.length = options.length || 0.0;
  }

  get numberOfChannels() {
    return this._numberOfChannels;
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
          this.input.output(t - this.position).map(v => v*this.level);
      });
      resolve();
    });
  }  
}

module.exports = { Part };