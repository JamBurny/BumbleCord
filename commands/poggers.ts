import type { Interaction, CacheType } from "discord.js";
import type { Command } from "../types.ts";

const command: Command = {
    name: "poggers",
    description: "test command!",
    execute: async (interaction: Interaction<CacheType>) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        await interaction.reply("excellent!");
    },
};

export default command;
