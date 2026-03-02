void main() {
  // Records
  var record = (1, 2, a: 3, b: 4);
  print(record.$1);
  print(record.a);

  // Pattern matching in variable declaration
  var (x, y) = (1, 2);
  print(x + y);

  // Switch pattern
  var pair = (1, 0);
  switch (pair) {
    case (int a, 0):
      print('First is $a, second is 0');
    case (0, int b):
      print('First is 0, second is $b');
    default:
      print('Neither is 0');
  }
}
