//
// DAW barrel file
// (c) Thor Muto Asmund, 2018
//

import * as Daw from './';

export function Song(options) { return Daw.Song.create(options) }
export function Track(options) { return Daw.Track.create(options) }
export function Sample(options) { return Daw.Sample.create(options) }

// export * from './mixer';

// export * from './functionGenerator';

// export * from './interfaces/part-object-interface.js';
// export * from './interfaces/generator-interface.js';
// export * from './interfaces/effect-interface.js';
// export * from './interfaces/cc-interface.js';

// export * from './helpers/log';
// export * from './helpers/reflection';
