import { z } from "zod/v4";
import { parseEnv } from "@Weldawadyathink/zod-env";

export const env = parseEnv(z.object({
  DATABASE_URL: z.string().url(),
  REPLICATE_API_TOKEN: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ENDPOINT_URL_S3: z.string().url(),
  AWS_S3_BUCKET: z.string(),
  NEW_POSTS_TO_DOWNLOAD: z.coerce.number().int().min(1),
}));
