class Point {
  final double x;
  final double y;

  Point(this.x, this.y);

  Point.origin()
      : x = 0,
        y = 0;

  double distanceTo(Point other) {
    return (x - other.x) * (x - other.x) + (y - other.y) * (y - other.y);
  }
}

void main() {
  var p = Point(10, 20);
  print(p.distanceTo(Point.origin()));
}
