import { copy, ensureDir, ensureFile, move } from "@std/fs";

export const bdfr = {
  download: async () => {
    console.log(`Starting BDFR download`);
    await ensureDir("./bdfr");
    const bdfr = new Deno.Command("./.venv/bin/bdfr", {
      args: [
        "download",
        "./bdfr",
        "--log",
        "./bdfr.log.txt",
        "--subreddit",
        "audiobookcovers",
        "--limit",
        "1",
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
