#!/bin/sh
rm -rf build; scripts/wasm-build.sh
rm -rf build-native; scripts/native-build.sh
rm performance.csv
echo "running native tests"
(build-native/openjpeg/bin/cpptest >> performance.csv)
echo "running WASM tests"
(cd test/node; npm run test > ../../wasm-performance.csv)
sed 1,4d wasm-performance.csv >> performance.csv
rm wasm-performance.csv
