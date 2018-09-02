//
// DAW Facade
// (c) Thor Muto Asmund, 2018
//

const { UID } = require('./uid');
//const { Dummy } = require('./dummy');

class Facade {
  constructor(definition, options = {}) {
    //this.song = Song.default;
    this.definition = definition;

    this.inputs = [];
    if (!this.definition.hasMultipleInputs) {
      this.definition.inputs.forEach(() => {
        const dummy = Dummy.create();
        this.inputs.push(dummy);
      })
    }
    this.inputs = this.definition.hasMultipleInputs ? [] : new Array(this.definition.inputs.length);
    this.outputs = new Array(this.definition.outputs.length);
  }

  addInput(object) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (!this.definition.hasMultipleInputs) {
      throw 'Cannot add input to a facade that does not have multiple inputs';
    }
    this.inputs.push(object);
  }

  setInput(object, idx) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (this.definition.hasMultipleInputs) {
      throw 'Cannot set input on a facade that has multiple inputs';
    }

    if (idx === undefined) {
      if (this.definition.inputs.length == 1) {
        this.inputs[0] = object;
      }
      else {
        const primaryInput = this.definition.inputs.find(input => input.isPrimary);
        if (!primaryInput) {
          throw 'Cannot set input when no primary input is defined';
        }
        const index = this.definition.inputs.indexOf(primaryInput);
        this.inputs[index] = object;
      }
    }
    else {
      if (idx < 0 || idx >= this.definition.inputs.length) {
        throw 'Cannot set input. Index out of bounds';
      }
      this.inputs[idx] = object;
    }
  }

  get input() {
    if (this.definition.hasMultipleInputs) {
      throw 'Cannot get default input on a facade that has multiple inputs';
    }

    if (this.definition.inputs.length == 1) {
      return this.inputs[0];
    }
    else {
      const primaryInput = this.definition.inputs.find(input => input.isPrimary);
      if (!primaryInput) {
        throw 'Cannot get input when no primary input is defined';
      }
      const index = this.definition.inputs.indexOf(primaryInput);
      return this.inputs[index];
    }
  }

  getInput(idx) {
    if (idx < 0 || idx >= this.inputs.length) {
      throw 'Cannot get input. Index out of bounds';
    }
    return this.inputs[idx];
  }

  get numberOfInputs() {
    return this.inputs.length;
  }

  setOutput(output) {
    if (this.definition.outputs.length == 1) {
      this.outputs[0] = output;
    }
    else {
      const primaryOutput = this.definition.outputs.find(output => output.isPrimary);
      if (!primaryOutput) {
        throw 'Cannot set output when no primary output is defined';
      }
      const index = this.definition.outputs.indexOf(primaryOutput);
      this.outputs[index] = output;
    }    
  }

  get output() {
    if (this.definition.outputs.length == 1) {
      return this.outputs[0];
    }
    else {
      const primaryOutput = this.definition.outputs.find(output => output.isPrimary);
      if (!primaryOutput) {
        throw 'Cannot get output when no primary output is defined';
      }
      const index = this.definition.outputs.indexOf(primaryOutput);
      return this.outputs[index];
    }    
  }
}

class Dummy {
  constructor() {
    this.uid = UID.getUID();
    //this.song = Song.default;

    // Set up facade
    const facadeDefinition = new FacadeDefinition({
      outputs: [
        new OutputDefinition({
          numberOfChannels: 1
        })
      ]
    });
    this.facade = new Facade(facadeDefinition);
  }

  static create() {
    return new Dummy();
  }

  prepare(start, length) {
    this.facade.setOutput(() => 0);
  }
}


class FacadeDefinition {
  constructor(options = {}) {
    this.hasMultipleInputs = options.hasMultipleInputs || false;

    this.inputs = options.inputs || [];
    this.outputs = options.outputs || [];
  }
}

class InputDefinition {
  constructor(options = {}) {
    this.name = options.name || '';
    this.isPrimary = options.isPrimary || false;
  }
}

class OutputDefinition {
  constructor(options = {}) {
    this.numberOfChannels = options.numberOfChannels || 2;  
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }
    this.name = options.name || '';
    this.isPrimary = options.isPrimary || false;
  }
}

module.exports = { Facade, FacadeDefinition, InputDefinition, OutputDefinition };