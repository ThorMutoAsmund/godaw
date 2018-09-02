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
    const facadeDefinition = new FacadeDefinition({
      hasMultipleInputs: true,
      outputs: [
        new OutputDefinition({
          numberOfChannels: this.numberOfChannels
        })
      ]
    });
    this.facade = new Facade(facadeDefinition);
  }

  add(object) {
    this.facade.addInput(object);

    return object;
  }

  addPart(position, object, options = {}) {
    const part = Part.create(position, object, options);
    this.facade.addInput(part);

    return part;
  }

  prepare(start, length) {
    if (this.numberOfChannels == 1) {
      this.facade.setOutput(t => {
        var v = this.facade.inputs.reduce(input => {
          (result, input) => 
            result + 
            input.facade.output(t).reduce(
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
      this.facade.setOutput(t => {
        var v = this.facade.inputs.reduce(
          (result, input) => 
            {
              var w = [0.0, 0.0];
              const o = input.facade.output(t);
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
  }


    // const song = Song.getSong(this);
  
    // this.facade.inputs.forEach(input => {
    //   input.prepare(start, length);
    // })
    
    // this.buffers = [];
    // for (var c = 0; c < this.numberOfChannels; ++c) {
    //   this.buffers[c] = new Float32Array(length);
    //   this.buffers[c].fill(0);
    // }
    // this.generatorList.forEach(part => {
    //   part.prepare(start, length);
    // })
}

module.exports = { Track };