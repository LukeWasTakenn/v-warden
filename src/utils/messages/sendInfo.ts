import { CommandInteraction, Message } from 'discord.js';
import { Colours } from '../../@types/Colours';
import sendEmbed from './sendEmbed';

export function sendSuccess(
    interaction: CommandInteraction,
    message: string,
    ephemeral?: boolean
): Promise<Message> {
    return sendEmbed({
        interaction,
        embed: {
            description: `\`🟢\` ${message}`,
            color: Colours.GREEN,
        },
        ephemeral: ephemeral ?? true,
    });
}

export function sendError(
    interaction: CommandInteraction,
    message: string,
    ephemeral?: boolean
): Promise<Message> {
    return sendEmbed({
        interaction,
        embed: {
            description: `\`🔴\` ${message}`,
            color: Colours.RED,
        },
        ephemeral: ephemeral ?? true,
    });
}
