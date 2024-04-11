import type { Interaction, CacheType } from "discord.js";
import type { CommandArgument, Command } from "../types.ts";
import { ApplicationCommandOptionType } from "discord.js";
import * as fs from "fs";

const consentFilePath = "./consent.json";

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
            var consent;

            var interactionUser = interaction.user;
            var queryUser = interaction.options.getUser("user");
            if (queryUser === null) {
                queryUser = interactionUser;
            }
            console.log(
                `${interactionUser.displayName} is checking consent for ${queryUser.displayName}`
            );
            consent = checkConsent(queryUser.id);
            interaction.reply(
                `${queryUser.globalName}'s consent status is: **${consent}**`
            );
        }

        // update
        if (subcommand === "update") {
            var value = interaction.options.getString("value");
            switch (value) {
                case "granted":
                    addConsent(interaction.user.id);
                    console.log(
                        `${displayName} has granted consent for Bumblebee to record their voice`
                    );
                    interaction.reply(
                        "Consent granted: Bumblebee will now record your voice"
                    );
                    break;
                case "denied":
                    removeConsent(interaction.user.id);
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
            options: [
                {
                    name: "user",
                    description: "The user to check consent for",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                },
            ],
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

const checkConsent = (checkUserId: string): boolean => {
    var consent = JSON.parse(fs.readFileSync(consentFilePath, "utf8"));
    for (var i in consent["users"]) {
        var curUserId = consent["users"][i];
        if (curUserId === checkUserId) return true;
    }
    return false;
};

const addConsent = (userId: string): void => {
    var consent = JSON.parse(fs.readFileSync(consentFilePath, "utf-8"));
    consent["users"].push(userId);
    fs.writeFileSync(consentFilePath, JSON.stringify(consent));
};

const removeConsent = (userId: string): void => {
    var consent = JSON.parse(fs.readFileSync(consentFilePath, "utf-8"));
    consent["users"] = consent["users"].filter(
        (curUserId: string) => curUserId !== userId
    );
    fs.writeFileSync(consentFilePath, JSON.stringify(consent));
};
export default command;
