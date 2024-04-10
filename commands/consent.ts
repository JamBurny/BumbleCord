import type { Interaction, CacheType } from "discord.js";
import type { CommandArgument, Command } from "../types.ts";
import { ApplicationCommandOptionType } from "discord.js";
import * as consent from "../consent.json";
import * as fs from "fs";

const consentFile = "./consent.json";

const command: Command = {
    name: "consent",
    description: "Update your consent for Bumblebee to record your voice",
    execute: async (interaction: Interaction<CacheType>) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== command.name) return;

        var displayName = interaction.user.displayName;
        var subcommand = interaction.options.getSubcommand();

        // check
        if (subcommand === "check") {
            var consent = checkConsent(parseInt(interaction.user.id));
            interaction.reply(
                "Your current consent status is: **" + consent + "**"
            );
        }

        // update
        if (subcommand === "update") {
            var value = interaction.options.getString("value");
            switch (value) {
                case "granted":
                    console.log(
                        `${displayName} has granted consent for Bumblebee to record their voice`
                    );
                    interaction.reply(
                        "Consent granted: Bumblebee will now record your voice"
                    );
                    break;
                case "denied":
                    console.log(
                        `${displayName} has denied consent for Bumblebee to record their voice`
                    );
                    interaction.reply(
                        "Consent denied: Bumblebee will no longer record your voice"
                    );
                    break;
            }
        }
    },
    options: [
        {
            name: "check",
            description:
                "Review your consent for Bumblebee to record your voice",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "update",
            description:
                "Update your consent for Bumblebee to record your voice",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "value",
                    description:
                        "Remove your consent for Bumblebee to record your voice",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        { name: "Grant", value: "granted" },
                        { name: "Deny", value: "denied" },
                    ],
                },
            ],
        },
    ],
};

const checkConsent = (userId: number): boolean => {
    for (var i in consent["users"]) {
        var user = consent["users"][i];
        if (user === userId) return true;
    }
    return false;
};

const addConsent = (userId: number): void => {};

const removeConsent = (userId: number): void => {};

export default command;
