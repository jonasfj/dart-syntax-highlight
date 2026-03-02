void main() {
  try {
    throw FormatException('error');
  } on FormatException catch (e) {
    print(e);
  } catch (e) {
    print('unknown');
  } finally {
    print('done');
  }
}
