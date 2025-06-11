import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "./env.ts";
import mime from "mime";
import { createReadStream } from "node:fs";
import * as path from "@std/path";

const client = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFile(filenameOnDisk: string, filenameOnS3: string) {
  const ContentType = mime.getType(filenameOnDisk);
  if (!ContentType) {
    throw new Error(`Could not determine content type for ${filenameOnDisk}`);
  }

  const Body = createReadStream(filenameOnDisk);
  const upload = new Upload({
    client,
    params: {
      Bucket: env.AWS_S3_BUCKET,
      Key: filenameOnS3,
      ContentType,
      Body,
    },
  });

  await upload.done();

  console.log(`Uploaded ${filenameOnS3} to s3 successfully`);
}
