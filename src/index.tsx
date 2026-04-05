import { Hono } from "hono";
import { api } from "./routes/api";
import { pages } from "./routes/pages";
import type { Env } from "./domain/types";

type HonoEnv = {
  Bindings: Env;
};

const app = new Hono<HonoEnv>();

app.get("/health", (c) => {
  return c.text("OK");
});

app.route("/api/v1", api);
app.route("/", pages);

export default app;
