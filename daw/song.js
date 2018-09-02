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
    const facadeDefinition = new FacadeDefinition({
      inputs: [
        { 
          name: 'audio',
          isPrimary: true 
        }
      ]
    });
    this.facade = new Facade(facadeDefinition);
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

  secondsToSamples(s) {
    return this.sampleRate*s;
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

  setInput(object) {
    this.facade.setInput(object);    
  }

  render(start, length) {
    var mainTrack = this.facade.input;
    
    const orderedList = [];
    this.getOrderedGeneratorList(this, orderedList);

    // this.facade.inputs
    orderedList.forEach(input => {
      input.prepare(start, length);
    })

    const buffers = new Array(mainTrack.numberOfChannels);
    if (mainTrack.numberOfChannels == 1) {
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
    if (mainTrack.numberOfChannels == 1) {
      while (t < length) {
        const v = mainTrack.facade.output(t + start);
        buffers[0][t] = v[0];
        t += 1;
      }
    }
    else {
      while (t < length) {
        const v = mainTrack.facade.output(t + start);
        buffers[0][t] = v[0];
        buffers[1][t] = v[1];
        t += 1;
      }
    }

    return buffers;
  }

  getOrderedGeneratorList(root, orderedList) {
    root.facade.inputs.forEach(input => {
      if (input.facade.inputs.length == 0) {
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