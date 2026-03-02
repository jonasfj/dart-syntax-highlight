class Animal {}
class Pet {}
class Dog extends Animal implements Pet {
  void bark() => print('woof');
}
mixin Flyer {}
class Bird extends Animal with Flyer {}
