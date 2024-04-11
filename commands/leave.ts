import type { Command } from "../types.ts";
import { getVoiceConnection } from "@discordjs/voice";

const command: Command = {
    name: "leave",
    description: "Get Bumblebee to leave the voice channel it is currenly in",
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;
        if (!interaction.guild) return;

        var botMember = interaction.guild.members.me;
        var voiceState = botMember?.voice;

        if (!voiceState?.channel) {
            interaction.reply({
                content: "I am not in a voice channel",
                ephemeral: true,
            });
            return;
        }
        interaction.reply({
            content: "Leaving voice channel",
            ephemeral: true,
        });
        getVoiceConnection(voiceState.guild.id)?.destroy();
    },
};

export default command;
