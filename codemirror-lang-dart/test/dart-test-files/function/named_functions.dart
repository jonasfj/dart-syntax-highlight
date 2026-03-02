void basic(int a, String b) {}

int optionalPositional(int a, [int? b]) => a + (b ?? 0);

String namedParameters({required String first, String last = ''}) {
  return '$first $last';
}

void main() {
  basic(1, '2');
  optionalPositional(1);
  namedParameters(first: 'John');
}
