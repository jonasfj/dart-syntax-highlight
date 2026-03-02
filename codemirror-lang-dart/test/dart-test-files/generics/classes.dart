class Box<T> {
  T value;
  Box(this.value);
  T unbox() => value;
}
void main() {
  var box = Box<int>(42);
  print(box.unbox());
}
