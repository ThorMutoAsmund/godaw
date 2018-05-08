//
// DAW Facade
// (c) Thor Muto Asmund, 2018
//

export class Facade {
  constructor(owner, definition, options = {}) {
    this.owner = owner;
    this.definition = definition;

    this.inputs = this.definition.hasMultipleInputs ? [] : new Array(this.definition.inputs.length);
  }

  addInput(object) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (!this.definition.hasMultipleInputs) {
      throw 'Cannot add input to a facade that does not have multiple inputs';
    }
    this.inputs.push(object);
    object.owners.push(this.owner);
  }

  setInput(object) {
    // if (!Reflection.implements(object, IPartObject.prototype)) {
    //   throw 'Cannot create part with object that does not implement IPartObject';
    // }

    if (this.definition.hasMultipleInputs) {
      throw 'Cannot set input on a facade that has multiple inputs';
    }
    if (this.definition.inputs.length == 1) {
      this.inputs[0] = object;
      object.owners.push(this.owner);
    }
    else {
      const primaryInput = this.definition.inputs.find(input => input.isPrimary);
      if (!primaryInput) {
        throw 'Cannot set input when no primary input is defined';
      }
      const index = this.definition.inputs.indexOf(primaryInput);
      this.inputs[index] = object;
      object.owners.push(this.owner);
    }
  }

  get input() {
    return this.inputs[0];
  }
}

export class FacadeDefinition {
  constructor(options = {}) {
    this.hasMultipleInputs = options.hasMultipleInputs || false;

    this.inputs = options.inputs || [];
    this.outputs = options.outputs || [];
  }
}

export class InputDefinition {
  constructor(options = {}) {
    this.name = options.name || '';
  }
}

export class OutputDefinition {
  constructor(options = {}) {
    this.numberOfChannels = options.numberOfChannels || 2;  
    if (this.numberOfChannels < 1 || this.numberOfChannels > 2) {
      throw 'Invalid number of channels';
    }
    this.name = options.name || '';
  }
}