//
// DAW Sample
// (c) Thor Muto Asmund, 2018
//

import { Song, Facade, FacadeDefinition, OutputDefinition } from './';
import { default as load } from 'audio-loader';

export class Sample {
  constructor(options = {}) {
    this.uid = Song.getUID();
    this.song = Song.default;

    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }
    this.length = options.length || 0;
    if (this.length < 0) {
      throw 'Invalid sample length';
    }
    
    this.sampleRate = options.sampleRate || this.song.sampleRate;
    if (this.sampleRate < 0) {
      throw 'Invalid sample rate';
    }
 
    // Set up facade
    const facadeDefinition = new FacadeDefinition({
        outputs: [
          new OutputDefinition({
            numberOfChannels: this.numberOfChannels
          })
        ]
      });
    this.facade = new Facade(facadeDefinition);
  
    if (options.buffers) {
      this.buffers = options.buffers;
    }
    else {
      this.buffers = new Array(this.numberOfChannels);
      for (var c = 0; c < this.numberOfChannels; ++c) {
        this.buffers[c] = new Float32Array(this.length);    
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
    if (index < 0 || index >= this.length) {
      throw 'Index out of bounds';
    }
    if (channel < 0 || channel >= this.numberOfChannels) {
      throw 'Channel out of bounds';
    }
    this.buffers[channel][index] = value;
  }
  
  prepare(start, length) {    
    const rateMultiplier = (0.0 + this.sampleRate) / this.song.sampleRate;
    const empty = this.numberOfChannels == 1 ? [0.0] : [0.0, 0.0];
    
    if (this.numberOfChannels == 1) {
      this.facade.setOutput(t => {
        var index = t*rateMultiplier;
        if (index < 0 || index >= this.length-1) {
          return empty;
        }
        var ia = index | 0;
        var d = index - ia;

        return [
          this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d
        ];
      });
    }
    else {
      this.facade.setOutput(t => {
        var index = rateMultiplier*t;
        var ia = index | 0;
        if (ia < 0 || ia >= this.length-1) {
          return empty;
        }
        var d = index - ia;

        return [
          this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d, 
          this.buffers[1][ia] * (1-d) + this.buffers[1][ia + 1] * d
        ];
      });
    }
  }
  
  render(start, chunkSize) {
    // Nop
  }
}