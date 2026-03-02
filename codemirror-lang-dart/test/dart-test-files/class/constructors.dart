class Point {
  int x, y;
  Point(this.x, this.y);
  Point.origin() : x = 0, y = 0;
  factory Point.zero() => Point.origin();
}
