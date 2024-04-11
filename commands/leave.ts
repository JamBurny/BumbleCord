import type { Command } from "../types.ts";

const command: Command = {
    name: "leave",
    description: "Get Bumblebee to leave the voice channel it is currenly in",
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;
        if (!interaction.guild) return;

        var botMember = interaction.guild.members.me;
        var voiceConnection = botMember?.voice;
        if (!voiceConnection?.sessionId) {
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
        voiceConnection.disconnect();
    },
};

export default command;
