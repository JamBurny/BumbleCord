import type { Interaction } from "discord.js";
import type { ApplicationCommandOption } from "discord.js";

type Command = {
    name: string;
    description: string;
    parameters?: CommandArgument[];
    execute: (message: Interaction) => Promise<void>;
    options?: ApplicationCommandOption[];
};

type CommandArgument = {
    name: string;
    description: string;
    type: number;
    required: boolean;
    options?: string[];
};

export type { Command, CommandArgument };
