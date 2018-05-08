//
// DAW Log
// (c) Thor Muto Asmund, 2018
//

export class Log {
  static generic(type, message, caller) {
    console.log(`${type ? `${type}: ` : ''}${caller ? `[${caller.name}] ` : ''}${message}`);
  }

  static debug(message, caller) {
    Log.generic(null, message, caller);
  }

  static warn(message, caller) {
    Log.generic('WARNING', message, caller);
  }

  static err(message, caller) {
    Log.generic('ERROR', message, caller);
  }
}

