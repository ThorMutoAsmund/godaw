//
// DAW Song
// (c) Thor Muto Asmund, 2018
//

export class Song {
  constructor(options = {}) {
    this.name = options.name || 'untitled';
    this.sampleRate = options.sampleRate || 48000;
    if (this.sampleRate <= 0) {
      throw 'Invalid song sample rate';
    }
    this.chunkSize = options.chunkSize || 32;
    if (this.sampleRate <= 0) {
      throw 'Invalid chunk size';
    }
     
    this.tracks = new Array();
  }

  static create(options) {
    Song.default = new Song(options);
    return Song.default;
  }

  addTrack(track) {
    this.tracks.push(track);
  }

  setName(name) {
    this.name = name;
  }

  render(start, length) {
    // Check that there is exactly one output track
    const numberOfOutputTracks = this.tracks.filter(track => track.isOutput).length;
    if (numberOfOutputTracks != 1) {
      throw 'There must be exactly one output track';
    }
    
    this.tracks.forEach(track => {
      track.prepare(start, length);
    })

    var t = 0;
    while (t < length) {
      // this.tracks.forEach(track => {
      //   track.render(t + start, Math.min(this.chunkSize, length - t));
      // })
      console.log(t + start, Math.min(this.chunkSize, length - t));

      t += this.chunkSize;  
    }
  }
}
