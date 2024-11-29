function renderToCanvas(frameInfo,decodedBuffer,canvas){

    const pixelData = getPixelData(frameInfo, decodedBuffer);
    var ctx = canvas.getContext("2d");

    canvas.width = frameInfo.width;
    canvas.height = frameInfo.height;
    var myImageData = ctx.createImageData(frameInfo.width, frameInfo.height);

    let imageData;
    if(frameInfo.componentCount > 1) {
      imageData = colorToCanvas(frameInfo, pixelData, myImageData, 2);
    } else {
      if(visualizeDeltas) {
        imageData = deltasToCanvas(frameInfo, pixelData, myImageData);
      } else {
        imageData = grayToCanvas(frameInfo, pixelData, myImageData);
      }
    }
    
    ctx.putImageData(imageData , 0, 0);
}

function getMinMax(frameInfo, pixelData) {
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

function getPixelData(frameInfo, decodedBuffer) {
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

  function colorToCanvas(frameInfo, pixelData, imageData) {
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

  function grayToCanvas(frameInfo, pixelData, imageData) {
    var outOffset = 0;
    var planeSize = frameInfo.width * frameInfo.height;
    var inOffset = 0;
   
    if(!minMax) {
      minMax = getMinMax(frameInfo, pixelData);
      $('#minPixel').text('' + minMax.min);
      $('#maxPixel').text('' + minMax.max);
    }

    //console.log(minMax);
    let dynamicRange = minMax.max - minMax.min;
    $('#dynamicRange').text('' + dynamicRange);
    //console.log('dynamicRange=', dynamicRange);
    let bitsOfData = 1;
    while(dynamicRange > 1) {
      dynamicRange = dynamicRange >> 1;
      bitsOfData++;
    }
    //console.log('bitsOfData = ', bitsOfData);
    let bitShift = bitsOfData - 8;
    const offset = -minMax.min;
    //console.log('bitShift=', bitShift);
    //console.log('offset=', offset);
    
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

  function deltasToCanvas(frameInfo, pixelData, imageData, signed) {
    if(!uncompressedImageFrame) {
      return;
    }
    const deltas = new Int32Array(frameInfo.height * frameInfo.width);
    const uif = getPixelData(frameInfo, uncompressedImageFrame, signed);
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
        if(uncompressedImageFrame) {
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
