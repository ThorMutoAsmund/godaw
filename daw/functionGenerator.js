//
// DAW FunctionGenerator
// (c) Thor Muto Asmund, 2018
//

export class FunctionGenerator {
  constructor(options = {}) {
    const dummy = (t) => 0.0;
    this.func = options.func | dummy;
  }

  static create(options) {
    const functionGenerator = new FunctionGenerator(options);
    return functionGenerator;
  }

  getValue(t) {
    return this.func(t);
  }  
}