import { REST, Routes } from "discord.js";
import type { Command } from "./types.ts";
import { Glob } from "bun";
const glob = new Glob("**/*.ts");

const TOKEN: string = process.env.TOKEN as string;
const CLIENT_ID: string = process.env.CLIENT_ID as string;

const registerCommands: (
    CLIENT_ID: string,
    TOKEN: string
) => Promise<Command[]> = async (CLIENT_ID, TOKEN) => {
    let commandList: Command[] = [];

    for await (const file of glob.scan("./commands")) {
        console.log(file); // => "index.ts"
        let command = require("./commands/" + file).default as Command;
        commandList.push(command);
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commandList,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }

    return commandList;
};

export { registerCommands };
