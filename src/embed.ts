import { z } from "zod/v4";
import ky from "ky";

const publicClipModelValidator = z.array(
  // Output format for public andreasjansson/clip-features on replicate
  z.object({
    embedding: z.array(z.coerce.number()),
    input: z.coerce.string(),
  }),
);

async function genericFlyClipModel(
  modelId: string,
  input: string,
) {
  const json = await ky.post(
    `https://${modelId}.fly.dev/predictions`,
    {
      json: {
        inputs: input,
      },
      timeout: false,
      retry: {
        limit: 10,
        methods: ["post"],
        backoffLimit: 1000,
      },
    },
  ).json();
  return publicClipModelValidator.parse(json);
}

export async function getEmbeddings(url: string) {
  return {
    mobileclip_s0:
      (await genericFlyClipModel("mobileclip-s0", url))[0].embedding,
    mobileclip_s1:
      (await genericFlyClipModel("mobileclip-s1", url))[0].embedding,
    mobileclip_s2:
      (await genericFlyClipModel("mobileclip-s2", url))[0].embedding,
    mobileclip_b: (await genericFlyClipModel("mobileclip-b", url))[0].embedding,
    mobileclip_blt:
      (await genericFlyClipModel("mobileclip-blt", url))[0].embedding,
  };
}
