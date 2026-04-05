import { Hono } from "hono";
import { createCloudinaryClient } from "../domain/cloudinary-client";
import { createGallery } from "../domain/gallery";
import { GalleryPage } from "../views/GalleryPage";
import { ImagePage } from "../views/ImagePage";
import { NotFoundPage } from "../views/NotFoundPage";
import type { Env } from "../domain/types";

type HonoEnv = {
  Bindings: Env;
};

const pages = new Hono<HonoEnv>();

pages.get("/", (c) => {
  return c.redirect("/images", 302);
});

pages.get("/images", async (c) => {
  const client = createCloudinaryClient(c.env);
  const images = await client.fetchAssets();

  return c.html(<GalleryPage images={images} />);
});

pages.get("/images/:id", async (c) => {
  const id = c.req.param("id");
  const client = createCloudinaryClient(c.env);
  const images = await client.fetchAssets();
  const gallery = createGallery(images);
  const nav = gallery.getNavigation(id);

  if (!nav) {
    return c.html(<NotFoundPage />, 404);
  }

  return c.html(<ImagePage nav={nav} />);
});

export { pages };
