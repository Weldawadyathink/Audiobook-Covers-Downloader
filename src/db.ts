import { createPool, createSqlTag } from "slonik";
import { createPgDriverFactory } from "./create_pg_driver_factory.ts";
import { z } from "zod";
import { isBlurhashValid } from "./blurhash.ts";
import {
  createQueryLoggingInterceptor,
} from "slonik-interceptor-query-logging";
import { getEmbeddings } from "./embed.ts";

const dbUrl = Deno.env.get("DATABASE_URL");
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable not set!");
}

export const pool = await createPool(dbUrl, {
  driverFactory: createPgDriverFactory(),
  interceptors: [createQueryLoggingInterceptor()],
});

export const sql = createSqlTag({
  typeAliases: {
    redditId: z.object({
      redditId: z.string().min(6).max(7),
    }),
    void: z.object({}).strict(),
  },
});

export async function getRedditIdList() {
  return await pool.manyFirst(
    sql.typeAlias("redditId")`
        SELECT DISTINCT REPLACE("source", 'https://reddit.com/', '') AS slug
        FROM image
        WHERE "source" LIKE 'https://reddit.com/%';
    `,
  );
}

export async function addImageToDatabase(data: {
  id: string;
  source: string;
  embedding: Awaited<ReturnType<typeof getEmbeddings>>;
  extension: string;
  blurhash: string;
}) {
  // Deno std includes a "." in the extension. Remove it.
  const fixedExtension = data.extension.replace(".", "");
  const blurhashValid = await isBlurhashValid(data.blurhash);
  if (!blurhashValid) {
    throw new Error("Invalid blurhash");
  }
  await pool.query(
    sql.typeAlias("void")`
        INSERT INTO image (id,
                           source,
                           extension,
                           blurhash,
                           embedding_mobileclip_s0,
                           embedding_mobileclip_s1,
                           embedding_mobileclip_s2,
                           embedding_mobileclip_b,
                           embedding_mobileclip_blt)
        VALUES (${data.id},
                ${data.source},
                ${fixedExtension},
                ${data.blurhash},
                ${JSON.stringify(data.embedding.mobileclip_s0)},
                ${JSON.stringify(data.embedding.mobileclip_s1)},
                ${JSON.stringify(data.embedding.mobileclip_s2)},
                ${JSON.stringify(data.embedding.mobileclip_b)},
                ${JSON.stringify(data.embedding.mobileclip_blt)});
    `,
  );
}
