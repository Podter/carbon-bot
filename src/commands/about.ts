import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { InteractionResponseType } from "discord-interactions";

import type { Command } from "~/types";

export const About = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About this bot."),
  async execute() {
    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Carbon")
      .setURL("https://github.com/Podter/carbon-bot")
      .setAuthor({
        name: "About",
      })
      .setDescription(
        "Made with love by [Podter](https://podter.me) using Cloudflare Pages and [cobalt.tools](https://cobalt.tools/)",
      )
      .setTimestamp();

    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        embeds: [embed.toJSON()],
      },
    };
  },
} satisfies Command;
