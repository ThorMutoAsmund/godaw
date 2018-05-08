//
// DAW FunctionGenerator
// (c) Thor Muto Asmund, 2018
//

export class FunctionGenerator {
  constructor(options = {}) {
    this.channels = options.channels || 2;
    if (this.channels < 1 || this.channels > 2) {
      throw 'Invalid number of channels';
    }
    this.sampleRate = options.sampleRate || 48000;
    if (this.sampleRate <= 0) {
      throw 'Invalid sample rate';
    }

    const dummy = (t) => 0.0;
    this.func = options.func || dummy;
  }

  static create(options) {
    const functionGenerator = new FunctionGenerator(options);
    return functionGenerator;
  }

  setTrack(track) {
    this.track = track;
  }

  getNumberOfChannels() {
    return this.numberOfChannels;
  }

  prepare(start, length) {
    if (!this.track) {
      throw 'No track set for this audio';
    }
    this.rateMultiplier = (0.0 + this.sampleRate) / this.track.song.sampleRate;
  }

  render(buffers, start, chunkSize) {
    for (var t = 0; t < chunkSize; ++t) {
      const i = (t * this.rateMultiplier) | 0;
      const value = this.func(i);
      if (this.numberOfChannels == 1) {
        buffers[0][t + start] += value[0];
      }
      else {
        buffers[0][t + start] += value[0];
        buffers[1][t + start] += value[1];
      }
    }
  }

  getValue(t) {
    return this.func((t * this.rateMultiplier) | 0);
  }
}