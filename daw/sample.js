//
// DAW Sample
// (c) Thor Muto Asmund, 2018
//

import { Facade, FacadeDefinition, OutputDefinition, Song } from './';

import { default as load } from 'audio-loader';

export class Sample {
  constructor(options = {}) {
    this.uid = Song.getUID();
    this.owners = [];
    
    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }
    this.sampleRate = options.sampleRate || 48000;
    if (this.sampleRate <= 0) {
      throw 'Invalid sample rate';
    }
    this.length = options.length || 0;
    if (this.length < 0) {
      throw 'Invalid track length';
    }
    
    if (options.buffers) {
      this.buffers = options.buffers;
    }
    else {
      this.buffers = new Array(this.numberOfChannels);
      for (var c = 0; c < this.numberOfChannels; ++c) {
        this.buffers[c] = new Float32Array(this.size);    
      }
      this.clear();
    }

    const facadeDefinition = new FacadeDefinition({
      outputs: [
        new OutputDefinition({
          numberOfChannels: this.numberOfChannels
        })
      ]
    });
    this.facade = new Facade(this, facadeDefinition);    
  }

  static create(options) {
    const sample = new Sample(options);
    return sample;
  }

  static fromFile(fileName, options) {
    // load one file
    return load(fileName).then(data => {
        const sample = new Sample({
          numberOfChannels: data.numberOfChannels,
          sampleRate: data.sampleRate,
          length: data.length,
          buffers: data._channelData
        });

        return sample;
    })
  }

  clear() {
    this.buffers.forEach(buffer => buffer.fill(0));
  }

  prepare(start, length) {
    const song = Song.getSong(this);
    this.rateMultiplier = (0.0 + this.sampleRate) / song.sampleRate;

    console.log(song.sampleRate);
  }

  render(buffers, start, chunkSize) {
    for (var t = 0; t < chunkSize; ++t) {
      const i = ((t + start) * this.rateMultiplier) | 0;
      if (i < this.length) {
        if (this.numberOfChannels == 1) {
          buffers[0][t + start] += this.buffers[0][i];
        }
        else {
          buffers[0][t + start] += this.buffers[0][i];
          buffers[1][t + start] += this.buffers[1][i];
        }
      }
    }
  }

  get duration() {
    return this.length / this.sampleRate;
  }

  set(channel, index, value) {
    if (index < 0 || index >= this.size) {
      throw 'Index out of bounds';
    }
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw 'Channel out of bounds';
    }
    this.buffers[channel][index] = value;
  }

  get(channel, index) {
    if (index < 0 || index >= this.size) {
      throw 'Index out of bounds';
    }
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw 'Channel out of bounds';
    }
    return this.buffers[channel][index];    
  }
}