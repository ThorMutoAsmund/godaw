//
// DAW barrel file
// (c) Thor Muto Asmund, 2018
//

module.exports = { 
  G: require('./g'),
  ...require('./daw'),
  ...require('./song'),
  ...require('./track'),
  ...require('./sample'),
  ...require('./part'),
  ...require('./effect')
};






// export * from './mixer';

// export * from './functionGenerator';

// export * from './interfaces/part-object-interface.js';
// export * from './interfaces/generator-interface.js';
// export * from './interfaces/effect-interface.js';
// export * from './interfaces/cc-interface.js';

// export * from './helpers/log';
// export * from './helpers/reflection';
