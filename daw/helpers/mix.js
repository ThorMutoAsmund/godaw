//
// DAW Mix
// (c) Thor Muto Asmund, 2018
//

const { getUID } = require('../g');

let Mix = (superClass) => class extends superClass {
  mix(start, length) {
    return new Promise(resolve => {
      if (this.numberOfChannels == 1) {
        this.setOutput(t => {
          var v = this.inputs.reduce(input => {
            (result, input) => 
              result + 
              input.output(t).reduce(
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
                const o = input.output(t);
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

module.exports = { Mix };