import { SlashCommandBuilder } from "@discordjs/builders";
import { InteractionResponseType } from "discord-interactions";

import type { Command } from "~/types";

export const Ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute() {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Pong!",
      },
    };
  },
} satisfies Command;
