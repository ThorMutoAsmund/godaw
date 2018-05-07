//
// DAW Log
// (c) Thor Muto Asmund, 2018
//

export class Log {
  static debug(caller, message) {
    console.log(`[${caller.name}] ${message}`);
  }

  static warn(caller, message) {
    console.log(`WARNING: [${caller.name}] ${message}`);
  }

  static err(caller, message) {
    console.log(`ERROR: [${caller.name}] ${message}`);
  }
}

