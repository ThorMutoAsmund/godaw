//
// DAW Sample
// (c) Thor Muto Asmund, 2018
//

import { default as load } from 'audio-loader';

export class Sample {
    constructor(options = {}) {
        this.channels = options.channels | 2;
        if (this.channels < 1 || this.channels > 2) {
            throw 'Invalid number of channels';
        }
        this.size = options.size | 0;
        if (this.size < 0) {
            throw 'Invalid track size';
        }
        
        this.buffers = new Array(this.channels);
        for (var c = 0; c < this.channels; ++c) {
            this.buffers[c] = new Float32Array(this.size);        
        }
        this.clear();
    }

    static create(options) {
        const sample = new Sample(options);
        return sample;
    }

    static fromFile(fileName, options) {
        // load one file
        return load(fileName).then(data => {
                console.log(data._channelData);
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

    getValue(t) {
        return 0.0;
    }

    get duration() {
        return this.length / this.sampleRate;
    }


    set(channel, index, value) {
        if (index < 0 || index >= this.size) {
            throw 'Index out of bounds';
        }
        if (channel < 0 || channel >= this.channels) {
            throw 'Channel out of bounds';
        }
        this.buffers[channel][index] = value;
    }

    get(channel, index) {
        if (index < 0 || index >= this.size) {
            throw 'Index out of bounds';
        }
        if (channel < 0 || channel >= this.channels) {
            throw 'Channel out of bounds';
        }
        return this.buffers[channel][index];        
    }
}