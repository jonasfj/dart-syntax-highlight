Future<int> fetchNumber() async => 42;

void main() async {
  var x = await fetchNumber();
  print(x);
}
