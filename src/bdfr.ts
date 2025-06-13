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
        "--limit",
        env.NEW_POSTS_TO_DOWNLOAD.toString(),
        "--sort",
        "new",
        "--file-scheme",
        "{POSTID}",
        "--exclude-id-file",
        "bdfr/exclude_id.txt",
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
