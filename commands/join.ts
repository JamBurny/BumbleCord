import {
    type Interaction,
    GuildMember,
    ApplicationCommandOptionType,
    type VoiceBasedChannel,
    GuildChannel,
    ChannelType,
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

        var argChannel = interaction.options.getChannel(
            "channel"
        ) as GuildChannel;

        // If the channel is not a voice channel, error
        if (argChannel && argChannel.type !== ChannelType.GuildVoice) {
            interaction.reply({
                content: "The channel you provided is not a voice channel",
                ephemeral: true,
            });
            return;
        }

        // If the user provided a channel, join that channel
        if (argChannel) {
            console.log(
                `${interaction.user.toString()} asked Bumblebee to join ${
                    argChannel.name
                }`
            );
            interaction.reply({
                content: `Joining ${argChannel.name}`,
                ephemeral: true,
            });
            joinVoiceChannel({
                channelId: argChannel.id,
                guildId: argChannel.guild.id,
                adapterCreator: argChannel.guild.voiceAdapterCreator,
            });
            return;
        }

        // If the user did not provide a channel and is not in a channel, error
        if (!member.voice.channel) {
            interaction.reply({
                content:
                    "You must to be in a voice channel or provide a channel for Bumblebee to join to use this command",
                ephemeral: true,
            });
            return;
        }

        // If the user did not provide a channel, join the channel they are in
        var joinChannel = member.voice.channel as VoiceBasedChannel;
        console.log(
            `${interaction.user.toString()} asked Bumblebee to join ${
                joinChannel.name
            }`
        );
        interaction.reply({
            content: `Joining ${joinChannel.name}`,
            ephemeral: true,
        });
        joinVoiceChannel({
            channelId: joinChannel.id,
            guildId: joinChannel.guild.id,
            adapterCreator: joinChannel.guild.voiceAdapterCreator,
        });
        return;
    },
};

export default command;
