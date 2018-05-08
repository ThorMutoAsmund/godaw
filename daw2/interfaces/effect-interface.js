//
// DAW IEffect
// (c) Thor Muto Asmund, 2018
//

export class IEffect {
  setTrack(track) {}
  prepare(start, length) {}
  render(buffers, bufferIndex, start, chunkSize) {}
}