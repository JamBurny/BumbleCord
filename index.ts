import { REST, Routes } from "discord.js";

const SECRET: string = process.env.SECRET as string;
const CLIENT_ID: string = process.env.CLIENT_ID as string;

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
];

const rest = new REST({ version: "10" }).setToken(SECRET);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}
