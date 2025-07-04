import { copy, ensureDir, ensureFile, move } from "@std/fs";
import { addImageToDatabase, getRedditIdList, pool, sql } from "./db.ts";
import { rm } from "node:fs/promises";
import { listFilesRecursively } from "./utils.ts";
import { bdfr } from "./bdfr.ts";
import { uploadFile, uploadFileFromStream } from "./s3.ts";
import * as path from "@std/path";
import mime from "mime";
import { imageTransformers } from "./image.ts";
import { createReadStream } from "node:fs";
import { getEmbeddings } from "./embed.ts";
import { blurhashEncode } from "./blurhash.ts";
import { env } from "./env.ts";

await rm("./bdfr", { recursive: true, force: true });

const redditIds = await getRedditIdList();
await ensureDir("./bdfr");
await Deno.writeTextFile("./bdfr/exclude_id.txt", redditIds.join("\n"));
console.log(`Loaded ${redditIds.length} reddit ids from database`);

await bdfr.download();
const files = await listFilesRecursively("./bdfr/AudiobookCovers");

for (const file of files) {
  const mimeType = mime.getType(file);
  const id = crypto.randomUUID();
  const extension = path.extname(file);
  const postId = path.basename(file).match(/(^[^_.\s]*)/);
  console.log(`Processing ${file} with type ${mimeType}`);
  if (!postId) {
    throw new Error(`Could not find post id for ${file}`);
  }
  const source = `https://reddit.com/${postId[0]}`;
  if (!mimeType) {
    throw new Error(`Could not find mime type for ${file}`);
  }
  if (!mimeType.startsWith("image/")) {
    console.log(
      `Skipping ${file} because it is not an image, type: ${mimeType}`,
    );
    continue;
  }

  await uploadFileFromStream(
    createReadStream(file),
    mimeType,
    `original/${id}${extension}`,
  );

  for (const transformer of imageTransformers) {
    await uploadFileFromStream(
      await transformer.getImageStream(file),
      transformer.mime_type,
      `${transformer.s3Directory}/${id}.${transformer.fileExtension}`,
    );
  }

  const originalImageUrl =
    `https://${env.AWS_S3_BUCKET}.fly.storage.tigris.dev/original/${id}${extension}`;
  const embeddingsPromise = getEmbeddings(originalImageUrl);
  const blurhashPromise = blurhashEncode(originalImageUrl);
  const blurhash = await blurhashPromise;
  const embeddings = await embeddingsPromise;
  // TODO: Need to get blurhash and source url for database entry
  await addImageToDatabase({
    id,
    source,
    embedding: embeddings,
    extension,
    blurhash,
  });
}
