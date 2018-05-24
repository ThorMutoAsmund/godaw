//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

import { Facade, FacadeDefinition } from './';

export class Song {
  constructor(options = {}) {    
    Song._default = this;
    this.uid = Song.getUID();

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
      hasMultipleInputs: true
    });
    this.facade = new Facade(facadeDefinition);
  }

  static create(options) {
    var result = new Song(options);
    return result;
  }

  static get default() {
    if (!Song._default) {
      throw 'No song is defined';
    }
    return Song._default;
  }

  static getUID() {
    if (Song.uid === undefined) {
      Song.uid = 0;
    }
    return Song.uid++;
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

  addTrack(track) {
    this.facade.addInput(track);    
  }

  render(start, length) {
    // Check that there is exactly one main track
    const numberOfMainTracks = this.facade.inputs.filter(input => input.isMain).length;
    if (numberOfMainTracks != 1) {
      throw 'There must be exactly one main track';
    }
    var mainTrack = this.facade.inputs.filter(input => input.isMain)[0];
    
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

    console.log(buffers[0]);
    if (mainTrack.numberOfChannels != 1) {
      console.log(buffers[1]);
    }

    // var t = 0;
    // const actualChunkSize = this.chunkSize == 0 ? length : this.chunkSize;
    // while (t < length) {
    //   orderedList.forEach(input => {
    //     input.render(t + start, Math.min(this.chunkSize, length - t));
    //     console.log('Rendering '+input.uid+' '+input.constructor.name)
    //   })

    //   t += actualChunkSize;
    // }
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

