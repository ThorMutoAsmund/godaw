//
// DAW Part
// (c) Thor Muto Asmund, 2018
//

import { Reflection, IPartObject } from './';

export class Part {
  constructor(object, options = {}) {
    if (!object) {
      throw 'Cannot create part without an object';
    }
    this.object = object;
    if (!Reflection.implements(object, IPartObject.prototype)) {
      throw 'Cannot create part with object that does not implement IPartObject';
    }

    this.position = options.position || 0;
    this.level = options.level || 1.0;
    this.offset = options.offset || 0.0;
    this.length = options.length || 0.0;
  }

  static create(options) {
    const part = new Part(options);
    return part;
  }

  prepare(start, length) {
    // Create buffer
    this.objectNumberOfChannels = this.object.getNumberOfChannels();
    this.renderStart = start;
    this.buffers = [];
    for (var c = 0; c < this.objectNumberOfChannels; ++c) {
      this.buffers[c] = new Float32Array(length);
      this.buffers[c].fill(0);
    }
    
    // Prepare object
    this.object.prepare(start, length);
  }

  render(trackBuffers, trackNumberOfChannels, start, chunkSize) {
    
    
    if (start >= (this.position + this.length) || (start + chunkSize) <= this.position) {
      return;
    }

    const s = start - this.position;
    if (s < 0) {
      chunkSize += s;
      start -= s;
    }

    const bufferOffset = start - this.position;
    this.object.render(this.buffers, bufferOffset, chunkSize);

    if (this.objectNumberOfChannels == 1 && trackNumberOfChannels == 1) {
      for (var t = 0; t < chunkSize; ++t) {
        this.buffers[0][bufferOffset + t] = this.offset + this.level * this.buffers[0][bufferOffset + t];
        trackBuffers[0][start + t] += this.buffers[0][bufferOffset + t];
      }
    }
    else if (this.objectNumberOfChannels == 1 && trackNumberOfChannels == 2) {
      for (var t = 0; t < chunkSize; ++t) {
        this.buffers[0][bufferOffset + t] = this.offset + this.level * this.buffers[0][bufferOffset + t];
        trackBuffers[0][start + t] += this.buffers[0][bufferOffset + t];
        trackBuffers[1][start + t] += this.buffers[0][bufferOffset + t];
      }
    }
    else if (this.objectNumberOfChannels == 2 && trackNumberOfChannels == 1) {
      for (var t = 0; t < chunkSize; ++t) {
        this.buffers[0][bufferOffset + t] = this.offset + this.level * this.buffers[0][bufferOffset + t];
        this.buffers[1][bufferOffset + t] = this.offset + this.level * this.buffers[1][bufferOffset + t];
        trackBuffers[0][start + t] += (this.buffers[0][bufferOffset + t] + this.buffers[1][bufferOffset + t]) / 2.0;
      }
    }
    else if (this.objectNumberOfChannels == 2 && trackNumberOfChannels == 2) {
      for (var t = 0; t < chunkSize; ++t) {
        this.buffers[0][bufferOffset + t] = this.offset + this.level * this.buffers[0][bufferOffset + t];
        this.buffers[1][bufferOffset + t] = this.offset + this.level * this.buffers[1][bufferOffset + t];
        trackBuffers[0][start + t] += this.buffers[0][bufferOffset + t];
        trackBuffers[1][start + t] += this.buffers[1][bufferOffset + t];
      }
    }
  }
}