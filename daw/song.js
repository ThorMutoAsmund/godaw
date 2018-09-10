//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

const { getUID } = require('./helpers/uid');
const { Facade, FacadeDefinition } = require('./helpers/facade');

class Song extends Facade(Object) {
  constructor(options = {}) {
    super();

    Song.setDefault(this);
    this.uid = getUID();

    this.name = options.name || 'untitled';
    this.sampleRate = options.sampleRate || 48000;
    if (this.sampleRate <= 0) {
      throw 'Invalid song sample rate';
    }
    this.chunkSize = options.chunkSize || 0;
    if (this.chunkSize < 0) {
      throw 'Invalid chunk size';
    }
     
    // Set up facade
    this.defineFacade({
      inputs: [
        { 
          name: 'audio',
          isPrimary: true 
        }
      ]
    });
  }

  static setDefault(song) {
    Song._default = song;
  }

  static get default() {
    if (!Song._default) {
      throw 'No song is defined';
    }
    return Song._default;
  }

  get numberOfChannels() {
    return this.getInput().numberOfChannels;
  }

  render(start, length) {
    var mainInput = this.getInput();
    
    const orderedList = [];
    this.getOrderedGeneratorList(this, orderedList);
    const buffers = new Array(this.numberOfChannels);
    return new Promise(resolve => {
      Promise.all(orderedList.map(input => input.prepare(start, length)
      )).then(() => {
        console.log('Preparation finished');
        
        if (this.numberOfChannels == 1) {
          buffers[0] = new Float32Array(length);
          buffers[0].fill(0.0);
        }
        else {
          buffers[0] = new Float32Array(length);
          buffers[0].fill(0.0);
          buffers[1] = new Float32Array(length);
          buffers[1].fill(0.0);
        }
    
        var t = 0;
        if (this.numberOfChannels == 1) {
          while (t < length) {
            const v = mainInput.getOutput()(t + start);
            buffers[0][t] = v[0];
            t += 1;
          }
        }
        else {
          while (t < length) {
            const v = mainInput.getOutput()(t + start);
            buffers[0][t] = v[0];
            buffers[1][t] = v[1];
            t += 1;
          }
        }
    
        resolve(buffers);
      }).catch(e => {
        console.log("RENDER ERROR", e)
      });


    });
  }

  getOrderedGeneratorList(root, orderedList) {
    root.inputs.forEach(input => {
      if (input.inputs.length == 0) {
        if (!orderedList.some(item => item.uid === input.uid)) {
          orderedList.push(input);
        }
      }
      else {
        this.getOrderedGeneratorList(input, orderedList);
        orderedList.push(input);
      }
    })
  }
}

module.exports = { Song };