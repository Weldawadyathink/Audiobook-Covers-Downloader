import { copy, ensureDir, ensureFile, move } from "@std/fs";
import { pool, sql } from "./db.ts";
import { rm } from "node:fs/promises";
import { listFilesRecursively } from "./utils.ts";
import { bdfr } from "./bdfr.ts";

await rm("./bdfr", { recursive: true, force: true });

const redditIds = await pool.manyFirst(
  sql.typeAlias("redditId")`
    SELECT DISTINCT
      REPLACE("source", 'https://reddit.com/', '') AS slug
    FROM
      image
    WHERE
      "source" LIKE 'https://reddit.com/%';
  `,
);

await ensureDir("./bdfr");
await Deno.writeTextFile("./bdfr/exclude_id.txt", redditIds.join("\n"));
console.log(`Loaded ${redditIds.length} reddit ids from database`);

await bdfr.download();
const files = await listFilesRecursively("./bdfr");

console.log(await listFilesRecursively("./bdfr"));
