
class myMixin {
  speak() {
    console.log("hi " + this.name);
  }
  get ucName() {
    return "this.name.toUpperCase()";
  }

}

class myClass {
  constructor() {
    this.name = "Thor";
  }
}

function getInstanceMethodNames (obj) {
  const proto = Object.getPrototypeOf (obj);
  const names = Object.getOwnPropertyNames (proto);
  console.log(names);
  return names.filter (name => {
    return name !='arguments' && name !='caller' && name !='constructor' && typeof obj[name] === 'function';
  });
}


 console.log(getInstanceMethodNames(new myMixin()));
 Object.assign(myClass.prototype, {
   speak: myMixin.prototype.speak,
   ucName: myMixin.prototype.ucName
 });

var a = new myClass();
a.speak();