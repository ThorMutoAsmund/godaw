
var handler = {
  get (target, key) {
    console.info(`Get on property "${key}"`)
    return target[key]*2;
  },
  speak () {
    console.log('Hey mate');
  }
}

var myClass = {
  talk () {
    console.log('Goobledigoob');
  }

}


var p = new Proxy(myClass, handler);

var s1 = new Symbol(2);

p.a = 20;
console.log(p.a);
p.speak();
