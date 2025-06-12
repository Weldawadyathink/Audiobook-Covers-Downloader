import { Buffer } from "node:buffer";
import sharp from "sharp";

export interface ImageTransformer {
  s3Directory: string;
  fileExtension: string;
  getImageStream: (filename: string) => Promise<Buffer<ArrayBufferLike>>;
  mime_type: string;
}

export const imageTransformers: ImageTransformer[] = [
  {
    s3Directory: "jpeg/1280",
    fileExtension: "jpg",
    mime_type: "image/jpeg",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(1280, 1280)
        .jpeg({ quality: 90, force: true })
        .toBuffer();
    },
  },
  {
    s3Directory: "jpeg/640",
    fileExtension: "jpg",
    mime_type: "image/jpeg",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(640, 640)
        .jpeg({ quality: 90, force: true })
        .toBuffer();
    },
  },
  {
    s3Directory: "jpeg/320",
    fileExtension: "jpg",
    mime_type: "image/jpeg",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(320, 320)
        .jpeg({ quality: 90, force: true })
        .toBuffer();
    },
  },
  {
    s3Directory: "webp/1280",
    fileExtension: "webp",
    mime_type: "image/webp",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(1280, 1280)
        .webp({ quality: 90, force: true })
        .toBuffer();
    },
  },
  {
    s3Directory: "webp/640",
    fileExtension: "webp",
    mime_type: "image/webp",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(640, 640)
        .webp({ quality: 90, force: true })
        .toBuffer();
    },
  },
  {
    s3Directory: "webp/320",
    fileExtension: "webp",
    mime_type: "image/webp",
    getImageStream: (filename: string) => {
      return sharp(filename)
        .resize(320, 320)
        .webp({ quality: 90, force: true })
        .toBuffer();
    },
  },
];
