import {
    type Interaction,
    type CacheType,
    userMention,
    Guild,
} from "discord.js";
import type { Command } from "../types.ts";

const command: Command = {
    name: "join",
    description: "Get Bumblebee to join your voice channel",
    execute: async (interaction: Interaction<CacheType>) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        var channelId = interaction.channelId;
    },
};

export default command;
