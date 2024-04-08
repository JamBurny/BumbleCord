import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
import type { Command } from "./types";
import { registerCommands } from "./register.ts";

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
let con: any;
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    console.log(newState.channel?.name);
    console.log(newState.member?.displayName);
    if (newState.channel?.id) {
        console.log("Yes");
    }
});

client.login(TOKEN);
