//
// DAW Effect
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

const { getUID } = require('./helpers/uid');
const { Song } = require('./song');
const { Facade, InputDefinition, OutputDefinition } = require('./helpers/facade');

class Effect extends Facade(Object) {
  constructor(process, numberOfChannels, options = {}) {
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
          numberOfChannels: this.numberOfChannels
        })
      ]
    });

    this.process = process;
    this._numberOfChannels = numberOfChannels;
    this.options = options;
  }

  static create(process, object, options) {
    if (!object) {
      throw 'Cannot create effect without an object';
    }

    const effect = new Effect(process, object.numberOfChannels, options);
    effect.setInput(object);
    
    return effect;
  }

  get length() {
    return this.getInput().length;
  }

  get numberOfChannels() {
    return this._numberOfChannels;
  }

  prepare(start, length) {
    return new Promise(resolve => {
      const empty = this.numberOfChannels == 1 ? [0.0] : [0.0, 0.0]
      this.setOutput(t => {
        return this.process(t, this.getInput(), this.options);
      });
      resolve();
    });
  }  
}

module.exports = { Effect };