# openjpegpjs

JS/WebAssembly build of [OpenJPEG](https://github.com/uclouvain/openjpeg)

NOTE - a forked version of OpenJPEG is currently used which has some changes to allow partial bitstream decoding

## Try It Out!

Try it in your browser [here](https://chafey.github.io/openjpegjs/test/browser/index.html)

## Building

This project uses git submodules to pull in OpenJPEG.  If developing, initialize the git submodules first:

```bash
git submodule update --init --recursive
```

This project uses Docker to provide a consistent developer environment.

Create docker container 'openjpegjsbuild'

```bash
scripts/docker-build.sh
```

Create shell inside openjpegjsbuild container:

```bash
scripts/docker-sh.sh
```

Install node 16 (inside docker shell):
```bash
nvm install 16
```

Install typescript (inside docker shell):
```bash
npm i typescript -g
```

To build WASM (inside docker shell):
```bash
scripts/wasm-build.sh
```

To build native C/C++ version (inside docker shell):
```bash
scripts/native-build.sh
```

Run performance test (inside docker shell):
```bash
scripts/performance.sh
```


## TODOS
1) Fix openjpeg cmake issue that overrides output directory to be wrong

## Using generated Javascript File:

1. install From `npm`:

```bash
npm i --save @abasb75/openjpeg
```

2. import `@abasb75/openjpeg`:

```js
import OpenJPEG from '@abasb75/openjpeg'

...
let decoder,encoder;
OpenJPEGWASM().then(function(openjpegjs) {
    decoder = new openjpegjs.J2KDecoder();
    encoder = new openjpegjs.J2KEncoder();
});
...


3. Decode `JPEG2000 File`:
