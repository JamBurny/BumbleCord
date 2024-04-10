import type { VoiceReceiver } from "@discordjs/voice";
import type { GuildMember } from "discord.js";
import { EndBehaviorType } from "@discordjs/voice";
import * as prism from "prism-media";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream";

export const createRecorder = (
    receiver: VoiceReceiver,
    member: GuildMember
) => {
    let opusStream = receiver.subscribe(member.id, {
        end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 100,
        },
    });

    let oggStream = new prism.opus.OggLogicalBitstream({
        opusHead: new prism.opus.OpusHead({
            channelCount: 2,
            sampleRate: 48000,
        }),
        pageSizeControl: {
            maxPackets: 1000,
        },
    });

    const filename = `./recordings/${Date.now()}-${
        member.user.displayName
    }.ogg`;

    const out = createWriteStream(filename);

    console.log(`👂 Started recording ${filename}`);

    pipeline(opusStream, oggStream, out, (err) => {
        if (err) {
            console.warn(
                `❌ Error recording file ${filename} - ${err.message}`
            );
        } else {
            console.log(`✅ Recorded ${filename}`);
        }
    });
};
