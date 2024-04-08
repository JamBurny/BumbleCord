import type { Interaction } from "discord.js";

type Command = {
    name: string;
    description: string;
    execute: (message: Interaction) => Promise<void>;
};

export type { Command };
