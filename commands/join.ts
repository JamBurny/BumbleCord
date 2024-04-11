import {
    type Interaction,
    type CacheType,
    userMention,
    Guild,
    GuildMember,
    ApplicationCommandOptionType,
} from "discord.js";
import type { Command } from "../types.ts";
import { joinVoiceChannel } from "@discordjs/voice";

const command: Command = {
    name: "join",
    description: "Get Bumblebee to join your voice channel",
    options: [
        {
            name: "channel",
            description: "The voice channel to join",
            type: ApplicationCommandOptionType.Channel,
            required: false,
        },
    ],
    execute: async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        const member = interaction.member as GuildMember;

        const voiceState = member.voice;

        if (voiceState.channel === null) {
            interaction.reply({
                content:
                    "You need to be in a voice channel to use this command",
                ephemeral: true,
            });
            return;
        }
        console.log(
            `${interaction.user.toString()} asked Bumblebee to join ${
                voiceState.channel.name
            }`
        );
        interaction.reply({
            content: `Joining ${voiceState.channel.name}`,
            ephemeral: true,
        });
        joinVoiceChannel({
            channelId: voiceState.channel.id,
            guildId: voiceState.guild.id,
            adapterCreator: voiceState.guild.voiceAdapterCreator,
        });
    },
};

export default command;
