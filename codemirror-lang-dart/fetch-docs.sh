#!/bin/bash -e

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -rf "$DIR/llm-docs"

mkdir -p "$DIR/llm-docs/lezer"
git clone https://github.com/lezer-parser/website.git "$DIR/llm-docs/lezer"

mkdir -p "$DIR/llm-docs/dart-sdk/tools/spec_parser"
curl -sl https://raw.githubusercontent.com/dart-lang/sdk/refs/heads/main/tools/spec_parser/Dart.g > "$DIR/llm-docs/dart-sdk/tools/spec_parser/Dart.g"

mkdir -p "$DIR/llm-docs/codemirror"
git clone https://github.com/codemirror/website.git "$DIR/llm-docs/codemirror"
