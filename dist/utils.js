"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderToCanvas = renderToCanvas;
function renderToCanvas(frameInfo, decodedBuffer, canvas, visualizeDeltas) {
    var pixelData = getPixelData(frameInfo, new Uint8Array(decodedBuffer));
    var ctx = canvas.getContext("2d");
    canvas.width = frameInfo.width;
    canvas.height = frameInfo.height;
    var myImageData = ctx === null || ctx === void 0 ? void 0 : ctx.createImageData(frameInfo.width, frameInfo.height);
    var imageData;
    if (!myImageData) {
        return;
    }
    if (frameInfo.componentCount > 1) {
        imageData = colorToCanvas(frameInfo, new Uint8Array(pixelData), myImageData);
    }
    else {
        if (visualizeDeltas) {
            imageData = deltasToCanvas(frameInfo, new Uint8Array(pixelData), myImageData, new Uint8Array(decodedBuffer));
        }
        else {
            imageData = grayToCanvas(frameInfo, new Uint8Array(pixelData), myImageData);
        }
    }
    ctx === null || ctx === void 0 ? void 0 : ctx.putImageData(imageData, 0, 0);
}
function getMinMax(frameInfo, pixelData) {
    var numPixels = frameInfo.width * frameInfo.height * frameInfo.componentCount;
    var min = pixelData[0];
    var max = pixelData[0];
    for (var i = 0; i < numPixels; i++) {
        if (pixelData[i] < min) {
            min = pixelData[i];
        }
        if (pixelData[i] > max) {
            max = pixelData[i];
        }
    }
    return { min: min, max: max };
}
function getPixelData(frameInfo, decodedBuffer) {
    if (frameInfo.bitsPerSample > 8) {
        if (frameInfo.isSigned) {
            return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
        }
        else {
            return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
        }
    }
    else {
        return decodedBuffer;
    }
}
function colorToCanvas(frameInfo, pixelData, imageData) {
    var outOffset = 0;
    var bytesPerSample = (frameInfo.bitsPerSample <= 8) ? 1 : 2;
    var planeSize = frameInfo.width * frameInfo.height * bytesPerSample;
    var shift = 0;
    if (frameInfo.bitsPerSample > 8) {
        shift = 8;
    }
    var inOffset = 0;
    for (var y = 0; y < frameInfo.height; y++) {
        for (var x = 0; x < frameInfo.width; x++) {
            imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
            imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
            imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
            imageData.data[outOffset++] = 255;
        }
    }
    return imageData;
}
function grayToCanvas(frameInfo, pixelData, imageData) {
    var outOffset = 0;
    var planeSize = frameInfo.width * frameInfo.height;
    var inOffset = 0;
    var minMax = getMinMax(frameInfo, pixelData);
    var dynamicRange = minMax.max - minMax.min;
    var bitsOfData = 1;
    while (dynamicRange > 1) {
        dynamicRange = dynamicRange >> 1;
        bitsOfData++;
    }
    var bitShift = bitsOfData - 8;
    var offset = -minMax.min;
    for (var y = 0; y < frameInfo.height; y++) {
        for (var x = 0; x < frameInfo.width; x++) {
            if (frameInfo.bitsPerSample <= 8) {
                var value = pixelData[inOffset++];
                imageData.data[outOffset] = value;
                imageData.data[outOffset + 1] = value;
                imageData.data[outOffset + 2] = value;
                imageData.data[outOffset + 3] = 255;
                outOffset += 4;
            }
            else // bitsPerSample > 8 
             {
                // Do a simple transformation to display 16 bit data:
                //  * Offset the pixels so the smallest value is 0
                //  * Shift the pixels to display the most significant 8 bits
                var fullPixel = pixelData[inOffset++] + offset;
                var value = (fullPixel >> bitShift);
                imageData.data[outOffset] = value;
                imageData.data[outOffset + 1] = value;
                imageData.data[outOffset + 2] = value;
                imageData.data[outOffset + 3] = 255;
                outOffset += 4;
            }
        }
    }
    return imageData;
}
function deltasToCanvas(frameInfo, pixelData, imageData, decodedBuffer) {
    var deltas = new Int32Array(frameInfo.height * frameInfo.width);
    var uif = getPixelData(frameInfo, decodedBuffer);
    var inOffset = 0;
    var outOffset = 0;
    for (var y = 0; y < frameInfo.height; y++) {
        for (var x = 0; x < frameInfo.width; x++) {
            var unc = uif[inOffset];
            var comp = pixelData[inOffset];
            deltas[inOffset++] = Math.abs(comp - unc);
        }
    }
    var deltaMinMax = getMinMax(frameInfo, deltas);
    inOffset = 0;
    for (var y = 0; y < frameInfo.height; y++) {
        for (var x = 0; x < frameInfo.width; x++) {
            if (decodedBuffer) {
                var delta = deltas[inOffset];
                inOffset++;
                imageData.data[outOffset] = delta;
                imageData.data[outOffset + 1] = delta;
                imageData.data[outOffset + 2] = delta;
                imageData.data[outOffset + 3] = 255;
                outOffset += 4;
            }
        }
    }
    return imageData;
}
