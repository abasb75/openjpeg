# @abasb75/openjpegp
JS/WebAssembly build of [OpenJPEG](https://github.com/uclouvain/openjpeg)

## Using generated Javascript File:
1. install From `npm`:

```bash
npm i --save @abasb75/openjpeg@2.5.2-u1
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

# Decode

```javascript

import {decode} from "@abasb75/openjpeg";

const decoded = await decode(arrayBuffer); // ArrayBuffer
console.log('decoded',decoded);


```

For see example you can use <a href="https://github.com/abasb75/openjpeg/blob/master/test/browser/index.html">this link</a>

## only decoder versions:

For see example you can use <a href="https://www.npmjs.com/package/@abasb75/openjpeg/v/2.5.2-decoder">2.5.2-decoder</a>
