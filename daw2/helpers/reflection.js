//
// DAW Reflection
// (c) Thor Muto Asmund, 2018
//

export class Reflection {
  static implements(object, intf) {
    if (!object) {
      return false;
    }

    Object.getOwnPropertyNames(intf).forEach( methodName => {
      if (methodName !== 'constructor') {
        if (typeof object[methodName] !== 'function') {
          return false;
        }
      }
    })

    return true;
  }
}

