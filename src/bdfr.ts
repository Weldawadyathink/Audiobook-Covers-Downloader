import { copy, ensureDir, ensureFile, move } from "@std/fs";
import { env } from "./env.ts";

export const bdfr = {
  download: async () => {
    console.log(`Starting BDFR download`);
    await ensureDir("./bdfr");
    const bdfr = new Deno.Command("./.venv/bin/bdfr", {
      args: [
        "download",
        "--verbose",
        "./bdfr",
        "--log",
        "./bdfr.log.txt",
        "--subreddit",
        "audiobookcovers",
        "--sort",
        env.REDDIT_SORT,
        "--time",
        env.REDDIT_SORT_TIME,
        "--file-scheme",
        "{POSTID}",
        "--exclude-id-file",
        "bdfr/exclude_id.txt",
        "--disable-module",
        "SelfPost",
      ],
      stdout: "inherit",
      stderr: "inherit",
    });
    const { success } = await bdfr.output();
    if (!success) {
      throw new Error("BDFR failed");
    }
  },
};
