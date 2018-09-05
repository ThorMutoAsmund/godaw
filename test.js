const a = { name:'thor', job:'programmer'};

class MyClass {
  constructor(options = {}) {
    const result = new MyClass();
    result = {...options,...result};
    result.started = true;
return result;
  }

  say(text) {
    console.log('HI ' + text);
  }
}

const m = new MyClass();
const n = new MyClass(a);

console.log(m,n);

//m.say('thor');

n.say('kenny');

