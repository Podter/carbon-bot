import { Hono } from "hono";
import { InteractionResponseType } from "discord-interactions";

import type { Bindings } from "./bindings";
import { middleware } from "./middleware";

const app = new Hono<{ Bindings: Bindings }>();

app.use(middleware);

app.post("/", async (c) => {
  return c.json({ type: InteractionResponseType.PONG });
});

export default app;
