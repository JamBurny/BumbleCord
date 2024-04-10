import { ApplicationCommand, REST, Routes } from "discord.js";
import type { Command, CommandArgument } from "./types.ts";
import { createRequire } from "module";
import { Glob } from "glob";

const require = createRequire(import.meta.url);

const TOKEN: string = process.env.TOKEN as string;
const CLIENT_ID: string = process.env.CLIENT_ID as string;
const GLOB = new Glob("commands/**.ts", {});

const registerCommands: (
    CLIENT_ID: string,
    TOKEN: string
) => Promise<Command[]> = async (CLIENT_ID, TOKEN) => {
    let commandList: Command[] = [];

    for await (const file of GLOB) {
        let command = (await require("./" + file)).default as Command;
        commandList.push(command);
    }

    const rest = new REST({ version: "10" }).setToken(TOKEN);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest
            .put(Routes.applicationCommands(CLIENT_ID), {
                body: commandList,
            })
            .then((response) => {
                // console.log(response);
            });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }

    return commandList;
};

export { registerCommands };
