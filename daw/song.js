//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

const { UID } = require('./uid');
const { Facade, FacadeDefinition } = require('./facade');

class Song {
  constructor(options = {}) {    
    Song.setDefault(this);
    this.uid = UID.getUID();

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

  // static getSong(object) {
  //   if (object instanceof Song) {
  //     return object;
  //   }
  //   if (object.swners.length > 0) {
  //     return Song.getSong(object.swners[0]);
  //   }

  //   throw 'Swner could not be retrieved';
  // }

  render(start, length) {
    var mainInput = this.getInput();
    
    const orderedList = [];
    this.getOrderedGeneratorList(this, orderedList);
    const buffers = new Array(mainInput.numberOfChannels);
    return new Promise(resolve => {
      Promise.all(orderedList.map(input => input.prepare(start, length)
      )).then(() => {
        console.log('Preparation finished');
        
        if (mainInput.numberOfChannels == 1) {
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
        if (mainInput.numberOfChannels == 1) {
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

// Mixin
Facade.assignTo(Song);

module.exports = { Song };