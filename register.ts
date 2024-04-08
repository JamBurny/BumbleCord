import { REST, Routes } from "discord.js";
import type { Command } from "./types.ts";

const SECRET: string = process.env.SECRET as string;
const CLIENT_ID: string = process.env.CLIENT_ID as string;

const registerCommands = async (
    commands: Command[],
    CLIENT_ID: string,
    TOKEN: string
) => {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
};

export { registerCommands };
