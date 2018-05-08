//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

import { Facade, FacadeDefinition } from './';

export class Song {
  constructor(options = {}) {    
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
     
    const facadeDefinition = new FacadeDefinition({
      hasMultipleInputs: true
    });
    this.facade = new Facade(this, facadeDefinition);
  }

  static create(options) {
    Song.default = new Song(options);
    return Song.default;
  }

  static getUID() {
    if (Song.uid === undefined) {
      Song.uid = 0;
    }
    return Song.uid++;
  }

  static getSong(object) {
    if (object instanceof Song) {
      return object;
    }
    if (object.owners.length > 0) {
      return Song.getSong(object.owners[0]);
    }

    throw 'Owner could not be retrieved';
  }

  addTrack(track) {
    this.facade.addInput(track);    
  }

  render(start, length) {
    // Check that there is exactly one main track
    const numberOfMainTracks = this.facade.inputs.filter(input => input.isMain).length;
    if (numberOfMainTracks != 1) {
      throw 'There must be exactly one main track';
    }
    
    const orderedList = [];
    this.getOrderedGeneratorList(this, orderedList);

    // this.facade.inputs
    orderedList.forEach(input => {
      input.prepare(start, length);
    })

    var t = 0;
    const actualChunkSize = this.chunkSize == 0 ? length : this.chunkSize;
    while (t < length) {
      orderedList.forEach(input => {
        input.render(t + start, Math.min(this.chunkSize, length - t));
      })
      console.log(t + start, Math.min(actualChunkSize, length - t));

      t += actualChunkSize;
    }
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

