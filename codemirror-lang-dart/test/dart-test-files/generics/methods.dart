T identity<T>(T value) {
  return value;
}
void main() {
  print(identity<String>('hello'));
}
