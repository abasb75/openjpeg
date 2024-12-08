#!/bin/sh
#rm -rf build

mkdir -p build
mkdir -p dist
#(cd build && emconfigure cmake -DCMAKE_BUILD_TYPE=Debug ..) &&
# enabling simd has no effort as of Oct 9, 2021
#(cd build && emcmake cmake -DCMAKE_C_FLAGS="-msimd128"  ..) &&
(cd build && emcmake cmake -DCMAKE_C_FLAGS="" ..) &&
(cd build && emmake make VERBOSE=1 -j) &&
cp ./build/openjpeg/bin/openjpegjs.js ./dist &&
cp ./build/openjpeg/bin/interface.d.ts ./dist
