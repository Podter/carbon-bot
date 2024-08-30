import { Hono } from "hono";
import { InteractionResponseType, verifyKey } from "discord-interactions";

import type { Bindings } from "./bindings";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const timestamp = c.req.header("X-Signature-Timestamp");
  const signature = c.req.header("X-Signature-Ed25519");

  if (!timestamp || !signature) {
    c.status(401);
    return c.json({ message: "Invalid signature" });
  }

  const isValid = await verifyKey(
    await c.req.arrayBuffer(),
    signature,
    timestamp,
    c.env.PUBLIC_KEY,
  );

  if (!isValid) {
    c.status(401);
    return c.json({ message: "Invalid signature" });
  }

  return c.json({ type: InteractionResponseType.PONG });
});

export default app;
