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
  return publicClipModelValidator.parse(json)[0];
}

export async function getEmbeddings(url: string) {
  const ps0 = genericFlyClipModel("mobileclip-s0", url);
  const ps1 = genericFlyClipModel("mobileclip-s1", url);
  const ps2 = genericFlyClipModel("mobileclip-s0", url);
  const pb = genericFlyClipModel("mobileclip-s2", url);
  const pblt = genericFlyClipModel("mobileclip-s2", url);
  const s0 = await ps0;
  const s1 = await ps1;
  const s2 = await ps2;
  const b = await pb;
  const blt = await pblt;
  return {
    mobileclip_s0: s0.embedding,
    mobileclip_s1: s1.embedding,
    mobileclip_s2: s2.embedding,
    mobileclip_b: b.embedding,
    mobileclip_blt: blt.embedding,
  };
}
