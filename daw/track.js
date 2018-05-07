//
// DAW Track
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

import { Log, Reflection, Song, Part, IGenerator, IEffect, ICC } from './';

export class Track {
  constructor(song, options = {}) {
    this.song = song;
    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
        throw 'Invalid number of channels';
    }
    this.isOutput = options.isOutput || false;

    this.generatorList = new Array();
    this.effectList = new Array();
    this.ccList = new Array();
  }

  static create(options) {
    if (!Song.default) {
      throw 'Cannot create track because no song is defined';
    }

    const track = new Track(Song.default, options);
    Song.default.addTrack(track);
    return track;
  }

  add(object, position = 0) {
    if (!Reflection.implements(object, IGenerator.prototype)) {
      throw `Cannot add this object to a track: '${object.constructor.name}'`;
    }
    const part = Part.create(object, {
      position
    });
    object.setTrack(this);
    this.generatorList.push(part)
    return part;
  }

  addEffect(object, position = 0) {
    if (!Reflection.implements(object, IEffect.prototype)) {
      throw `Cannot add this object to a track: '${object.constructor.name}'`;
    }
    const part = Part.create(object, {
      position
    });
    object.setTrack(this);
    this.effectList.push(part)
    return part;
  }

  addCC(object, position = 0) {
    if (!Reflection.implements(object, ICC.prototype)) {
      throw `Cannot add this object to a track: '${object.constructor.name}'`;
    }
    const part = Part.create(object, {
      position
    });
    object.setTrack(this);
    this.ccList.push(part);
    return part;
  }

  prepare(start, length) {
    if (!this.song) {
      throw 'No song set for this track';
    }

    this.buffers = [];
    for (var c = 0; c < this.numberOfChannels; ++c) {
      this.buffers[c] = new Float32Array(length);
      this.buffers[c].fill(0);
    }
    this.generatorList.forEach(part => {
      part.prepare(start, length);
    })
  }

  render(start, chunkSize) {
    this.generatorList.forEach(part => {
      part.render(this.buffers, this.numberOfChannels, start, chunkSize);
    })
  }
}
