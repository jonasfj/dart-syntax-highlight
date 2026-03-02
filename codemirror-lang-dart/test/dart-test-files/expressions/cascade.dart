class Builder {
  void add() {}
  void build() {}
}

void main() {
  Builder()
    ..add()
    ..add()
    ..build();
}
