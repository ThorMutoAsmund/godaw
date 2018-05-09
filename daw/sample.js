//
// DAW Sample
// (c) Thor Muto Asmund, 2018
//

import { Song, Facade, FacadeDefinition, OutputDefinition } from './';
import { default as load } from 'audio-loader';

export class Sample {
  constructor(options = {}) {
    this.uid = Song.getUID();
    this.owners = [];

    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }
    this.size = options.size || 0;
    if (this.size < 0) {
      throw 'Invalid sample size';
    }
    const song = Song.getSong(this);
    this.sampleRate = options.sampleRate || song.sampleRate;
    if (this.sampleRate < 0) {
      throw 'Invalid sample rate';
    }
 
    const facadeDefinition = new FacadeDefinition({
        outputs: [
          new OutputDefinition({
            numberOfChannels: this.numberOfChannels
          })
        ]
      });
    this.facade = new Facade(this, facadeDefinition);
  
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
  }

  static create(options) {
    const sample = new Sample(options);
    return sample;
  }

  static fromFile(fileName, options) {
    // load one file
    return load(fileName).then(data => {
        const sample = new Sample({
            channels: data.numbeOfChannels,
            sampleRate: data.sampleRate,
            length: data.length,
            buffers: data._channelData
        })

        return sample;
    })
  }

  clear() {
    this.buffers.forEach(buffer => buffer.fill(0));
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
  
  prepare(start, length) {
    const song = Song.getSong(this);
    this.rateMultiplier = (0.0 + this.sampleRate) / song.sampleRate;
    console.log(this.rateMultiplier);

    if (this.numberOfChannels == 1) {
      this.facade.setOutput(t => {
        return [this.buffers[0][t]];
      });
    }
    else {
      this.facade.setOutput(t => {
        return [this.buffers[0][t], this.buffers[0][t]];
      });
    }
  }
  
  render(start, chunkSize) {
    // Nop
  }
}