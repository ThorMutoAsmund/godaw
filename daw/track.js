//
// DAW Track
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

const { UID } = require('./uid');
const { Song } = require('./song');
const { Facade, FacadeDefinition, OutputDefinition } = require('./facade');
const { Part } = require('./part');

class Track {
  constructor(options = {}) {
    this.uid = UID.getUID();
    this.song = Song.default;

    this.numberOfChannels = options.numberOfChannels || 2;
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

  addPart(position, object, options = {}) {
    const part = Part.create(position, object, options);
    this.addInput(part);

    return part;
  }

  prepare(start, length) {
    return new Promise(resolve => {
      if (this.numberOfChannels == 1) {
        this.setOutput(t => {
          var v = this.inputs.reduce(input => {
            (result, input) => 
              result + 
              input.getOutput()(t).reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0.0
              )
            ,
            0.0
          });
          return [v];
        });
      }
      else {
        this.setOutput(t => {
          var v = this.inputs.reduce(
            (result, input) => 
              {
                const o = input.getOutput()(t);
                if (o.length == 1) {
                  return [result[0] + o[0], result[1] + o[0]];
                }
                else {
                  return [result[0] + o[0], result[1] + o[1]];
                }              
              }           
            ,
            [0.0, 0.0]
          );
          return v;
        });
      }

      resolve();
    });
  }
}

// Mixin
Facade.assignTo(Track);

module.exports = { Track };