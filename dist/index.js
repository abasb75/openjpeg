"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderToCanvas = exports.decode = void 0;
var openjpegjs_1 = require("./openjpegjs");
var decode_1 = require("./decode");
exports.decode = decode_1.default;
var utils_1 = require("./utils");
Object.defineProperty(exports, "renderToCanvas", { enumerable: true, get: function () { return utils_1.renderToCanvas; } });
exports.default = openjpegjs_1.default;
