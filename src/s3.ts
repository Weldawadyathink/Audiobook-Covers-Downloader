import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "./env.ts";
import mime from "mime";
import { createReadStream, ReadStream } from "node:fs";
import { Buffer } from "node:buffer";

const client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileFromStream(
  stream: ReadStream | ReadableStream | Buffer,
  mime_type: string,
  filenameOnS3: string,
) {
  const upload = new Upload({
    client,
    params: {
      Bucket: env.AWS_S3_BUCKET,
      Key: filenameOnS3,
      ContentType: mime_type,
      Body: stream,
    },
  });

  await upload.done();

  console.log(`Uploaded ${filenameOnS3} to s3 successfully`);
}

export async function uploadFile(filenameOnDisk: string, filenameOnS3: string) {
  const mime_type = mime.getType(filenameOnDisk);
  if (!mime_type) {
    throw new Error(`Could not determine content type for ${filenameOnDisk}`);
  }

  const stream = createReadStream(filenameOnDisk);
  return await uploadFileFromStream(stream, mime_type, filenameOnS3);
}
