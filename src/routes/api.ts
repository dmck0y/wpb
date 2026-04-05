import { Hono } from "hono";
import { createCloudinaryClient } from "../domain/cloudinary-client";
import { corsMiddleware } from "../middleware/cors";
import type { Env } from "../domain/types";

type HonoEnv = {
  Bindings: Env;
};

const api = new Hono<HonoEnv>();

api.use("/*", corsMiddleware);

api.get("/assets", async (c) => {
  const client = createCloudinaryClient(c.env);
  const images = await client.fetchAssets();

  return c.json({ images });
});

export { api };
