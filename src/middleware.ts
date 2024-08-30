import { createMiddleware } from "hono/factory";
import { verifyKey } from "discord-interactions";

import type { Bindings } from "./types";

export const middleware = createMiddleware<{ Bindings: Bindings }>(
  async (c, next) => {
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

    await next();
  },
);
