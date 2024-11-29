# @abasb75/openjpegp
JS/WebAssembly build of [OpenJPEG](https://github.com/uclouvain/openjpeg)

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

```

For see example you can use <a href="https://github.com/abasb75/openjpeg/blob/master/test/browser/index.html">this link</a>