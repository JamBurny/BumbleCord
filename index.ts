import { Client, GatewayIntentBits, Events } from "discord.js";
import type { Command } from "./types";
import { registerCommands } from "./register.ts";
import { Glob } from "bun";
const glob = new Glob("**/*.ts");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const CLIENT_ID: string = process.env.CLIENT_ID as string;
const TOKEN: string = process.env.TOKEN as string;

client.once(Events.ClientReady, () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
});

let commandList: Command[] = [];
for await (const file of glob.scan("./commands")) {
    console.log(file); // => "index.ts"
    let command = require("./commands/" + file).default as Command;
    commandList.push(command);
}

registerCommands(commandList, CLIENT_ID, TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
    for (let command of commandList) {
        await command.execute(interaction);
    }
});

client.login(TOKEN);
