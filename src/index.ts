import { Hono } from "hono";
import { InteractionResponseType, InteractionType } from "discord-interactions";

import type { Bindings } from "./bindings";
import { middleware } from "./middleware";

const app = new Hono<{ Bindings: Bindings }>();

app.use(middleware);

app.post("/", async (c) => {
  const { type } = await c.req.json<{ type: InteractionType }>();

  switch (type) {
    case InteractionType.PING:
      return c.json({ type: InteractionResponseType.PONG });
    default:
      c.status(400);
      return c.json({ message: "Invalid type" });
  }
});

export default app;
