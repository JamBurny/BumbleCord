import type {
    Interaction,
    CacheType,
    ChatInputCommandInteraction,
} from "discord.js";
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
        var subcommand = interaction.options.getSubcommand();

        if (subcommand === "check") {
            handleCheckConsent(interaction);
        }
        if (subcommand === "update") {
            handleUpdateConsent(interaction);
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

const handleCheckConsent = (
    interaction: ChatInputCommandInteraction<CacheType>
): void => {
    var interactionUser = interaction.user;
    var queryUser = interaction.options.getUser("user");
    if (queryUser === null) {
        queryUser = interactionUser;
    }
    console.log(
        `${interactionUser.displayName} is checking consent for ${queryUser.displayName}`
    );
    var consent = checkConsent(queryUser.id);
    interaction.reply({
        content: `${queryUser.globalName}'s consent status is: **${consent}**`,
        ephemeral: true,
    });
};

const handleUpdateConsent = (
    interaction: ChatInputCommandInteraction<CacheType>
): void => {
    var updateValue = interaction.options.getString("value");
    var displayName = interaction.user.displayName;

    if (updateValue === "granted") {
        addConsent(interaction.user.id);
        console.log(
            `${displayName} has granted consent for Bumblebee to record their voice`
        );
        interaction.reply({
            content: "Consent granted: Bumblebee will now record your voice",
            ephemeral: true,
        });
        ("Consent granted: Bumblebee will now record your voice");
    } else if (updateValue === "denied") {
        removeConsent(interaction.user.id);
        console.log(
            `${displayName} has denied consent for Bumblebee to record their voice`
        );
        interaction.reply({
            content:
                "Consent denied: Bumblebee will no longer record your voice",
            ephemeral: true,
        });
    }
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
