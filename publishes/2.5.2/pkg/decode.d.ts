import { DecodeOptions, DecodedOpenJPEG } from "./types";
declare function decode(imageBuffer: ArrayBuffer, options?: DecodeOptions): Promise<DecodedOpenJPEG>;
export default decode;
