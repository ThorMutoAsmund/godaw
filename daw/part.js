//
// DAW Part
// (c) Thor Muto Asmund, 2018
//

import { Reflection, IAudio } from './';

export class Part {
  constructor(audio, options = {}) {
    if (!audio) {
      throw 'Cannot create part without audio';
    }
    this.audio = audio;
    if (!Reflection.implements(audio, IAudio.prototype)) {
      throw 'Cannot create part with object that does not implement IAudio';
    }

    this.position = options.position | 0;
    this.level = options.level | 1.0;
    this.offset = options.offset | 0.0;
    this.length = options.length | 0.0;
  }

  static create(options) {
    const part = new Part(options);
    return part;
  }

  getValue(t) {
    if (t < this.position) {
      return 0.0;
    }
    t -= this.position;
    if (this.length > 0.0 && t >= this.length) {
      return 0.0;
    }

    return this.offset + this.level * this.audio.getValue(t);
  }
}