//
// DAW Mixer
// (c) Thor Muto Asmund, 2018
//

const { UID } = require('./uid');
const { Facade, FacadeDefinition, OutputDefinition } = require('./facade');
const { Song } = require('./song');

class Mixer {
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

    // Define tracks
    if (options.tracks) {
      options.tracks.forEach(track => {
        this.addInput(track);
      });
    }
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
                var w = [0.0, 0.0];
                const o = input.getOutput()(t);
                if (o.length == 1) {
                  w[0] += o[0];
                  w[1] += o[0];
                }
                else {
                  w[0] += o[0];
                  w[1] += o[1];
                }

                return [result[0] + w[0], result[1] + w[1]];
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
Facade.assignTo(Mixer);

module.exports = { Mixer };