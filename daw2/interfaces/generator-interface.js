//
// DAW IGenerator
// (c) Thor Muto Asmund, 2018
//

export class IGenerator {
  setTrack(track) {}
  prepare(start, length) {}
  render(buffers, bufferIndex, start, chunkSize) {}
}