import { SlashCommandBuilder } from "@discordjs/builders";

import type { Command } from "~/types";

export const Ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute() {
    return {
      content: "Pong!",
    };
  },
} satisfies Command;
