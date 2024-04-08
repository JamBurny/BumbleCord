import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN: string = process.env.TOKEN as string;

client.on("ready", () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}!`);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
});

client.login(TOKEN);
