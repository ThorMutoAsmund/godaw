//
// DAW Facade
// (c) Thor Muto Asmund, 2018
//

const { UID } = require('./uid');
//const { Dummy } = require('./dummy');

class Facade {
  static assignTo(cls) {
    Object.assign(cls.prototype, {
      defineFacade: Facade.prototype.defineFacade,
      addInput: Facade.prototype.addInput,
      setInput: Facade.prototype.setInput,
      getInput: Facade.prototype.getInput,
      setOutput: Facade.prototype.setOutput,
      getOutput: Facade.prototype.getOutput      
    });
  }

  defineFacade(options) {
    //this.song = Song.default;
    this.facadeDefinition = new FacadeDefinition(options);

    this.inputs = [];
    if (!this.facadeDefinition.hasMultipleInputs) {
      this.facadeDefinition.inputs.forEach(() => {
        const dummy = Dummy.create();
        this.inputs.push(dummy);
      })
    }
    this.inputs = this.facadeDefinition.hasMultipleInputs ? [] : new Array(this.facadeDefinition.inputs.length);
    this.outputs = new Array(this.facadeDefinition.outputs.length);
  }

  addInput(object) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (!this.facadeDefinition.hasMultipleInputs) {
      throw 'Cannot add input to a facade that does not have multiple inputs';
    }
    this.inputs.push(object);

    return object;
  }

  setInput(object, idx) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (this.facadeDefinition.hasMultipleInputs) {
      throw 'Cannot set input on a facade that has multiple inputs';
    }

    if (idx === undefined) {
      if (this.facadeDefinition.inputs.length == 1) {
        this.inputs[0] = object;
      }
      else {
        const primaryInput = this.facadeDefinition.inputs.find(input => input.isPrimary);
        if (!primaryInput) {
          throw 'Cannot set input when no primary input is defined';
        }
        const index = this.facadeDefinition.inputs.indexOf(primaryInput);
        this.inputs[index] = object;
      }
    }
    else {
      if (idx < 0 || idx >= this.facadeDefinition.inputs.length) {
        throw 'Cannot set input. Index out of bounds';
      }
      this.inputs[idx] = object;
    }
  }

  getInput(idx) {
    if (idx === undefined) {
      if (this.facadeDefinition.hasMultipleInputs) {
        throw 'Cannot get default input on a facade that has multiple inputs';
      }
  
      if (this.facadeDefinition.inputs.length == 1) {
        return this.inputs[0];
      }
      else {
        const primaryInput = this.facadeDefinition.inputs.find(input => input.isPrimary);
        if (!primaryInput) {
          throw 'Cannot get input when no primary input is defined';
        }
        const index = this.facadeDefinition.inputs.indexOf(primaryInput);
        return this.inputs[index];
      }
    }

    if (idx < 0 || idx >= this.inputs.length) {
      throw 'Cannot get input. Index out of bounds';
    }
    return this.inputs[idx];
  }

  setOutput(output) {
    if (this.facadeDefinition.outputs.length == 1) {
      this.outputs[0] = output;
    }
    else {
      const primaryOutput = this.facadeDefinition.outputs.find(output => output.isPrimary);
      if (!primaryOutput) {
        throw 'Cannot set output when no primary output is defined';
      }
      const index = this.facadeDefinition.outputs.indexOf(primaryOutput);
      this.outputs[index] = output;
    }    
  }

  getOutput() {
    if (this.facadeDefinition.outputs.length == 1) {
      return this.outputs[0];
    }
    else {
      const primaryOutput = this.facadeDefinition.outputs.find(output => output.isPrimary);
      if (!primaryOutput) {
        throw 'Cannot get output when no primary output is defined';
      }
      const index = this.facadeDefinition.outputs.indexOf(primaryOutput);
      return this.outputs[index];
    }    
  }
}

class Dummy {
  constructor() {
    this.uid = UID.getUID();
    //this.song = Song.default;

    // Set up facade
    this.defineFacade({
      outputs: [
        new OutputDefinition({
          numberOfChannels: 1
        })
      ]
    });
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

// Mixin
Facade.assignTo(Dummy);


module.exports = { Facade, FacadeDefinition, InputDefinition, OutputDefinition };