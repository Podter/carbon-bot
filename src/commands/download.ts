import { Buffer } from "node:buffer";
import type { Context } from "hono";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-interactions";

import type { Bindings, Command } from "~/types";

type CobaltResponse =
  | {
      status: "error";
      text: string;
    }
  | {
      status: "redirect" | "stream";
      url: string;
    };

export const Download = {
  data: new SlashCommandBuilder()
    .setName("download")
    .setDescription("Download a video from URL.")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("URL of the video")
        .setRequired(true),
    ),
  async execute(c) {
    const body = await c.req.json<{
      data: { options: [{ value: string }] };
      token: string;
    }>();

    c.executionCtx.waitUntil(
      downloadVideo(c, body.data.options[0].value, body.token),
    );

    return {
      type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      data: {},
    };
  },
} satisfies Command;

async function downloadVideo(
  c: Context<{ Bindings: Bindings }>,
  url: string,
  token: string,
) {
  const res = await fetch(c.env.COBALT_API, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  }).then((res) => res.json() as Promise<CobaltResponse>);

  const rest = new REST().setToken(c.env.TOKEN);

  if (res.status === "error") {
    await rest.patch(Routes.webhookMessage(c.env.APPLICATION_ID, token), {
      body: {
        content: "Something went wrong while downloading the video.",
      },
    });
    return;
  }

  if (res.status === "redirect" || res.status === "stream") {
    const video = await fetch(res.url);

    const filename = video.headers
      .get("content-disposition")
      ?.split("filename=")[1]
      ?.replace(/"/g, "");

    await rest.patch(Routes.webhookMessage(c.env.APPLICATION_ID, token), {
      files: [
        {
          name: filename ?? "video.mp4",
          data: Buffer.from(await video.arrayBuffer()),
        },
      ],
    });
    return;
  }

  await rest.patch(Routes.webhookMessage(c.env.APPLICATION_ID, token), {
    body: {
      content: "Something went wrong while downloading the video.",
    },
  });
}
