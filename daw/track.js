//
// DAW Track
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

import { Facade, FacadeDefinition, OutputDefinition, Song, Part } from './';

export class Track {
  constructor(options = {}) {
    this.uid = Song.getUID();
    this.owners = [];

    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
        throw 'Invalid number of channels';
    }

    if (options.isMain === undefined && Song.default) {
      this.isMain = !Song.default.facade.inputs.some(input => input.isMain);
    }
    else {
      this.isMain = options.isMain || false;
    }

    const facadeDefinition = new FacadeDefinition({
      hasMultipleInputs: true,
      outputs: [
        new OutputDefinition({
          numberOfChannels: this.numberOfChannels
        })
      ]
    });
    this.facade = new Facade(this, facadeDefinition);
    
    if (options.song) {
      options.song.facade.addInput(this);
    }
    else {
      if (Song.default) {
        Song.default.facade.addInput(this);
      }
    }
  }

  static create(options) {
    const track = new Track(options);
    return track;
  }

  add(object) {
    this.facade.addInput(object);

    return object;
  }

  addPart(object, position, options = {}) {
    const part = Part.create(object, position, options);
    this.facade.addInput(part);

    return part;
  }

  // add(object, position = 0) {
  //   if (!Reflection.implements(object, IGenerator.prototype)) {
  //     throw `Cannot add this object to a track: '${object.constructor.name}'`;
  //   }
  //   const part = Part.create(object, {
  //     position
  //   });
  //   object.setTrack(this);
  //   this.generatorList.push(part)
  //   return part;
  // }

  // addEffect(object, position = 0) {
  //   if (!Reflection.implements(object, IEffect.prototype)) {
  //     throw `Cannot add this object to a track: '${object.constructor.name}'`;
  //   }
  //   const part = Part.create(object, {
  //     position
  //   });
  //   object.setTrack(this);
  //   this.effectList.push(part)
  //   return part;
  // }

  // addCC(object, position = 0) {
  //   if (!Reflection.implements(object, ICC.prototype)) {
  //     throw `Cannot add this object to a track: '${object.constructor.name}'`;
  //   }
  //   const part = Part.create(object, {
  //     position
  //   });
  //   object.setTrack(this);
  //   this.ccList.push(part);
  //   return part;
  // }

  prepare(start, length) {
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

  render(start, chunkSize) {
    this.facade.inputs.forEach(input => {
        
    })
    // this.generatorList.forEach(part => {
    //   part.render(this.buffers, this.numberOfChannels, start, chunkSize);
    // })
  }
}
