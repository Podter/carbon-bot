import type {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import type { InteractionResponseType } from "discord-interactions";
import type { Context } from "hono";

export type Awaitable<T> = PromiseLike<T> | T;

export interface Bindings {
  APPLICATION_ID: string;
  PUBLIC_KEY: string;
  TOKEN: string;
  DEV_GUILD_ID: string;
}

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (c: Context<{ Bindings: Bindings }>) => Awaitable<CommandResponse>;
}

export interface CommandResponse {
  type: InteractionResponseType;
  data: unknown;
}
