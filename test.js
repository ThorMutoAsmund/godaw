let mixin = (superClass) => class extends superClass {
  getName() {
    return 'Thor';
  }
  get name() {
    return 'Bent';
  }
}

class person
{
  getJob() {
    return 'developer';
  }
}

class me extends mixin(person)
{
  getAge() {
    return '45';
  }  
}

var p = new me();

console.log(p.getAge(), p.getJob(), p.getName(), p.name);