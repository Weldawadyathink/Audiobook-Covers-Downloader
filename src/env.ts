import { z } from "zod/v4";
import { parseEnv } from "@Weldawadyathink/zod-env"; //TODO: Switch to @keawade/zod-env once PR is merged

export const env = parseEnv(z.object({
  DATABASE_URL: z.url(),
  REPLICATE_API_TOKEN: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_ENDPOINT_URL_S3: z.url(),
  AWS_S3_BUCKET: z.string(),
  REDDIT_SORT_TIME: z.string(),
  REDDIT_SORT: z.string(),
}));
