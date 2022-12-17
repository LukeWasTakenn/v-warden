import { Command } from '../../structures/Command';
import actionUser from '../../utils/actioning/actionUser';
import { sendError, sendSuccess } from '../../utils/messages';

export default new Command({
    name: 'scanusers',
    description: 'Initiates a guild scan',
    defaultMemberPermissions: 'Administrator',
    run: async ({ interaction, client }) => {
        if (!interaction.guild) return sendError(interaction, 'Must be used in a guild');

        const guild = client.guilds.cache.get(interaction.guild.id);
        if (!guild) return sendError(interaction, 'Unable to find guild in cache');

        const settings = await client.prisma.getGuild(
            { id: interaction.guild.id },
            { punishments: true, logChannel: true }
        );
        if (!settings) return sendError(interaction, 'Unable to find guild in database');
        if (!settings.punishments?.enabled) return sendError(interaction, 'Punishments are not enabled');

        await guild.members.fetch().then(async members => {
            const memberMap = members.map(x => x.id);
            const users = await client.prisma.getManyUsers({
                id: { in: memberMap },
                status: { notIn: ['APPEALED', 'WHITELISTED'] },
            });
            if (users.length === 0) return;

            if (!settings.punishments) return sendError(interaction, 'No punishments set for this guild');
            if (!settings.logChannel) return sendError(interaction, 'Must have a log channel set');

            sendSuccess(interaction, 'Scanning..');

            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                await actionUser(client, guild, settings.logChannel, settings.punishments, user);
            }

            return;
        });
        return false;
    },
});
