import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import type { Command } from "./types";
import { registerCommands } from "./register.ts";
import { joinVoiceChannel, getVoiceConnection } from "@discordjs/voice";
import { createRecorder } from "./src/createRecorder.ts";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const CLIENT_ID: string = process.env.CLIENT_ID as string;
const TOKEN: string = process.env.TOKEN as string;

client.once(Events.ClientReady, () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
});

let commandList: Command[] = await registerCommands(CLIENT_ID, TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
    for (let command of commandList) {
        await command.execute(interaction);
    }
});
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    if (!newState.member) return;
    if (newState.member?.user.bot) return;
    newState.guild.commands.fetch();
    if (newState.channel?.id) {
        if (
            !getVoiceConnection(newState.guild.id) ||
            getVoiceConnection(newState.guild.id)?.joinConfig.channelId !==
                newState.channel.id
        ) {
            let channel = joinVoiceChannel({
                channelId: newState.channel.id,
                guildId: newState.guild.id,
                adapterCreator: newState.guild.voiceAdapterCreator,
                selfDeaf: false,
            });
            let member = newState.member;
            let receiver = channel.receiver;
            receiver.speaking.on("start", () => {
                createRecorder(channel.receiver, member);
            });
        }
    } else {
        getVoiceConnection(newState.guild.id)?.destroy();
    }
});

client.login(TOKEN);
