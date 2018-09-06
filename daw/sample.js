//
// DAW Sample
// (c) Thor Muto Asmund, 2018
//

const { UID } = require ('./uid');
const { Song } = require('./song');
const { Facade, FacadeDefinition, OutputDefinition } = require('./facade');
const load = require('audio-loader');

class Sample {
  constructor(options = {}) {
    this.uid = UID.getUID();
    this.song = Song.default;

    if (options.file) {
      this.file = options.file;
    }

    this.numberOfChannels = options.numberOfChannels || 2;
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }

    this.length = options.length || 0;
    if (this.length < 0) {
      throw 'Invalid sample length';
    }
    
    if (!this.file) {
      this.sampleRate = options.sampleRate || this.song.sampleRate;
      if (this.sampleRate < 0) {
        throw 'Invalid sample rate';
      }
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
  
    if (!this.file) {
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
  }

  clear() {
    if (!this.file) {
      this.buffers.forEach(buffer => buffer.fill(0));
    }
  }

  get duration() {
    return this.length / this.sampleRate;
  }

  set(channel, index, value) {
    if (!this.file) {
      if (index < 0 || index >= this.length) {
        throw 'Index out of bounds';
      }
      if (channel < 0 || channel >= this.numberOfChannels) {
        throw 'Channel out of bounds';
      }
      this.buffers[channel][index] = value;
    }
  }
  
  prepare(start, length) {    
    return new Promise((resolve, reject) => {
      (!this.file ? Promise.resolve() : load(this.file).then(data => {
        this.sampleNumberOfChannels = data.numberOfChannels;
        this.sampleRate = data.sampleRate;
        if (!this.length) {
          this.length = data.length;
        }
        this.buffers = data._channelData;
      })).then(() => {
        const rateMultiplier = (0.0 + this.sampleRate) / this.song.sampleRate;
        const empty = this.numberOfChannels == 1 ? [0.0] : [0.0, 0.0];
        
        if (this.numberOfChannels == 1) {
          this.facade.setOutput(t => {
            var index = t*rateMultiplier;
            var ia = index | 0;
            if (ia < 0 || ia >= this.length-1) {
              return empty;
            }
            var d = index - ia;
  
            if (this.file && this.sampleNumberOfChannels != this.numberOfChannels) {
              return [
                ((this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d) +
                (this.buffers[1][ia] * (1-d) + this.buffers[1][ia + 1] * d)) / 2
              ];
            }
            else {
              return [
                this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d
              ];
            }
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
  
            if (this.file && this.sampleNumberOfChannels != this.numberOfChannels) {
              var v = this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d;
              return [v, v];
            }
            else {
              return [
                this.buffers[0][ia] * (1-d) + this.buffers[0][ia + 1] * d, 
                this.buffers[1][ia] * (1-d) + this.buffers[1][ia + 1] * d
              ];
            }
          });
        }

        resolve();
      }).catch(e => {
        reject(e);
      })
    });
  }
}

module.exports = { Sample };