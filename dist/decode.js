"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var openjpegjs_1 = require("./openjpegjs");
var openjpegjs;
function decode(imageBuffer_1) {
    return __awaiter(this, arguments, void 0, function (imageBuffer, options) {
        var iterations, decodeLevel, decodeLayer, decoder, buffer, encodedBuffer, i, resolutionAtLevel, maxDecodeLevel, maxDecodeLayer, frameInfo, imageOffset, numberOfDecompositions, progressionOrder, isReversible, blockDimensions, tileSize, tileOffset, colorSpace, decodedBuffer, subResolutions, i, resolution;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!openjpegjs) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, openjpegjs_1.default)()];
                case 1:
                    openjpegjs = _a.sent();
                    _a.label = 2;
                case 2:
                    iterations = options.iterations || 1;
                    decodeLevel = options.decodeLevel || 0;
                    decodeLayer = options.decodeLayer || 0;
                    decoder = new openjpegjs.J2KDecoder();
                    buffer = new Uint8Array(imageBuffer);
                    encodedBuffer = decoder.getEncodedBuffer(buffer.length);
                    encodedBuffer.set(buffer);
                    for (i = 0; i < iterations; i++) {
                        decoder.decodeSubResolution(decodeLevel, decodeLayer);
                    }
                    resolutionAtLevel = decoder.calculateSizeAtDecompositionLevel(decodeLevel);
                    maxDecodeLevel = decoder.getNumDecompositions();
                    maxDecodeLayer = decoder.getNumLayers();
                    frameInfo = decoder.getFrameInfo();
                    imageOffset = decoder.getImageOffset();
                    numberOfDecompositions = decoder.getNumDecompositions();
                    progressionOrder = decoder.getProgressionOrder();
                    isReversible = decoder.getIsReversible();
                    blockDimensions = decoder.getBlockDimensions();
                    tileSize = decoder.getTileSize();
                    tileOffset = decoder.getTileOffset();
                    colorSpace = decoder.getColorSpace();
                    decodedBuffer = decoder.getDecodedBuffer();
                    subResolutions = '';
                    for (i = 0; i < decoder.getNumDecompositions() + 1; i++) {
                        resolution = decoder.calculateSizeAtDecompositionLevel(i);
                        subResolutions += resolution.width + 'x' + resolution.height + ' ';
                    }
                    frameInfo.width = resolutionAtLevel.width;
                    frameInfo.height = resolutionAtLevel.height;
                    return [2 /*return*/, {
                            frameInfo: frameInfo,
                            decodedBuffer: decodedBuffer,
                            colorSpace: colorSpace,
                            maxDecodeLevel: maxDecodeLevel,
                            maxDecodeLayer: maxDecodeLayer,
                            imageOffset: imageOffset,
                            numberOfDecompositions: numberOfDecompositions,
                            blockDimensions: blockDimensions,
                            progressionOrder: progressionOrder,
                            isReversible: isReversible,
                            tileSize: tileSize,
                            tileOffset: tileOffset,
                            resolutionAtLevel: resolutionAtLevel,
                        }];
            }
        });
    });
}
exports.default = decode;
