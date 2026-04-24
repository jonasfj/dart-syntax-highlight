class Vector {
  final int x, y;
  Vector(this.x, this.y);

  Vector operator +(Vector other) => Vector(x + other.x, y + other.y);
  bool operator ==(Object other) => other is Vector && x == other.x && y == other.y;
  int operator [](int index) => index == 0 ? x : y;

  @override
  int get hashCode => Object.hash(x, y);
}

void main() {
  var v1 = Vector(1, 2);
  var v2 = Vector(3, 4);
  var v3 = v1 + v2;
  print(v3[0]);
}
