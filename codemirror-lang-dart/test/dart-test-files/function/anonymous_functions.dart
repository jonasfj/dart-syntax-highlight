void main() {
  var list = [1, 2, 3];
  
  // Arrow function
  list.forEach((i) => print(i));
  
  // Block body
  list.forEach((i) {
    print(i * 2);
  });
  
  // With types
  var multiply = (int a, int b) => a * b;
  print(multiply(3, 4));
}
