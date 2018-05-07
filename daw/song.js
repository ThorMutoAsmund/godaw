//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

import { Log } from './';

export class Song {
  constructor(options = {}) {
    this.name = options.name | 'untitled';
    this.tracks = new Array();
  }

  static create(options) {
    Song.default = new Song(options);
    return Song.default;
  }

  addTrack(track) {
    this.tracks.push(track);
  }
}
