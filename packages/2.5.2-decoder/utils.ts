//@ts-nocheck
import { FrameInfo } from "./types";

export function renderToCanvas(frameInfo:FrameInfo,decodedBuffer:ArrayBufferLike,canvas:HTMLCanvasElement,visualizeDeltas?:boolean){

    const pixelData = getPixelData(frameInfo, new Uint8Array(decodedBuffer));
    var ctx = canvas.getContext("2d");

    canvas.width = frameInfo.width;
    canvas.height = frameInfo.height;
    var myImageData = ctx?.createImageData(frameInfo.width, frameInfo.height);

    let imageData;
    if(!myImageData){
      return;
    }

    if(frameInfo.componentCount > 1) {
      imageData = colorToCanvas(frameInfo, new Uint8Array(pixelData), myImageData);
    } else {
      if(visualizeDeltas) {
        imageData = deltasToCanvas(frameInfo, new Uint8Array(pixelData), myImageData,new Uint8Array(decodedBuffer));
      } else {
        imageData = grayToCanvas(frameInfo, new Uint8Array(pixelData), myImageData);
      }
    }
    
    ctx?.putImageData(imageData , 0, 0);
}

function getMinMax(frameInfo:FrameInfo, pixelData:ArrayBufferLike) {
    const numPixels = frameInfo.width * frameInfo.height * frameInfo.componentCount;
    let min = pixelData[0];
    let max = pixelData[0];
    for(let i=0; i < numPixels; i++) {
      if(pixelData[i] < min) {
        min = pixelData[i];
      }
      if(pixelData[i] > max) {
        max = pixelData[i];
      }
    }
    return {min, max};
}

function getPixelData(frameInfo:FrameInfo, decodedBuffer:Uint8Array) {
    if(frameInfo.bitsPerSample > 8) {
      if(frameInfo.isSigned) {
        return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
      } else {
        return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
      }
    } else {
      return decodedBuffer;
    }
}

function colorToCanvas(frameInfo:FrameInfo, pixelData:Uint8Array, imageData:ImageData) {
    let outOffset = 0;
    const bytesPerSample = (frameInfo.bitsPerSample <= 8) ? 1 : 2;
    let planeSize = frameInfo.width * frameInfo.height * bytesPerSample;
    let shift = 0;
    if(frameInfo.bitsPerSample > 8) {
      shift = 8;
    }
    let inOffset = 0;
   
    for(var y=0; y < frameInfo.height; y++) {
      for (var x = 0; x < frameInfo.width; x++) {
        imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
        imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
        imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
        imageData.data[outOffset++] = 255;
      }
    }

    return imageData;
  }

function grayToCanvas(frameInfo:FrameInfo, pixelData:Uint8Array, imageData:ImageData) {
    var outOffset = 0;
    var planeSize = frameInfo.width * frameInfo.height;
    var inOffset = 0;
   
    const minMax = getMinMax(frameInfo, pixelData);

    let dynamicRange = minMax.max - minMax.min;
    let bitsOfData = 1;
    while(dynamicRange > 1) {
      dynamicRange = dynamicRange >> 1;
      bitsOfData++;
    }

    let bitShift = bitsOfData - 8;
    const offset = -minMax.min;
    
    for(var y=0; y < frameInfo.height; y++) {
      for (var x = 0; x < frameInfo.width; x++) {
        if(frameInfo.bitsPerSample <= 8) {
          const value = pixelData[inOffset++];
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
          const fullPixel = pixelData[inOffset++] + offset;
          let value = (fullPixel >> bitShift);
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

  function deltasToCanvas(frameInfo:FrameInfo, pixelData:Uint8Array, imageData:ImageData, decodedBuffer:Uint8Array) {

    const deltas = new Int32Array(frameInfo.height * frameInfo.width);
    const uif = getPixelData(frameInfo, decodedBuffer);
    let inOffset = 0;
    let outOffset = 0;
    for(var y=0; y < frameInfo.height; y++) {
      for (var x = 0; x < frameInfo.width; x++) {
          const unc = uif[inOffset];
          const comp = pixelData[inOffset];
          deltas[inOffset++] = Math.abs(comp - unc);
      }
    }
    const deltaMinMax = getMinMax(frameInfo, deltas);
    inOffset = 0;

    for(var y=0; y < frameInfo.height; y++) {
      for (var x = 0; x < frameInfo.width; x++) {
        if(decodedBuffer) {
          const delta = deltas[inOffset];
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
