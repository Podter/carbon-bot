import { Hono } from "hono";
import { Collection } from "@discordjs/collection";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { InteractionResponseType, InteractionType } from "discord-interactions";

import type { Bindings, Command, CommandResponse } from "./types";
import { appCommands } from "~/commands";
import { middleware } from "./middleware";

const app = new Hono<{ Bindings: Bindings }>();

const commands = new Collection<string, Command>();
appCommands.forEach((command) => commands.set(command.data.name, command));

app.post("/interactions", middleware, async (c) => {
  const body = await c.req.json<{
    type: InteractionType;
    data: { name: string };
  }>();

  switch (body.type) {
    case InteractionType.PING:
      return c.json({ type: InteractionResponseType.PONG });
    case InteractionType.APPLICATION_COMMAND: {
      const command = commands.get(body.data.name);

      if (!command) {
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Unknown command",
          },
        } satisfies CommandResponse);
      }

      try {
        const result = await command.execute(c);
        return c.json(result);
      } catch {
        return c.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "An error occurred while executing the command. Please try again later.",
          },
        } satisfies CommandResponse);
      }
    }
    default:
      c.status(400);
      return c.json({ message: "Invalid type" });
  }
});

app.get("/register-commands", async (c) => {
  const rest = new REST().setToken(c.env.TOKEN);

  const payload = {
    body: commands.map((command) => command.data.toJSON()),
  };

  if (c.env.DEV_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(c.env.APPLICATION_ID, c.env.DEV_GUILD_ID),
      payload,
    );
  }

  if (!c.req.query("devonly")) {
    await rest.put(Routes.applicationCommands(c.env.APPLICATION_ID), payload);
  }

  return c.json({ message: "Success" });
});

export default app;
