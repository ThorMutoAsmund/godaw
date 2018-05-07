//
// DAW Track
// (c) Thor Muto Asmund, 2018
//

// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

import { Log, Reflection, Song, Part, IAudio } from './';

export class Track {
  constructor(options = {}) {
    this.audio = new Array();
  }

  static create(options) {
    if (!Song.default) {
      throw 'Cannot create track because no song is defined';
    }

    const track = new Track(options);
    Song.default.addTrack(track);
    return track;
  }

  add(position, audio) {
    if (!Reflection.implements(audio, IAudio.prototype)) {
      throw 'Cannot add object that does not implement IAudio';
    }
    this.audio.push(Part.create(audio, {
      position
    }))
  }
}
