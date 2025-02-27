import { Colours } from '../../@types/Colours';
import { Command } from '../../structures/Command';
import sendEmbed from '../../utils/messages/sendEmbed';

export default new Command({
    name: 'checkself',
    description: 'Find out which blacklisted servers you were found in',
    run: async ({ interaction, client }) => {
        const imports = await client.prisma.getImports(interaction.user.id);

        if (imports.length <= 0) {
            return sendEmbed({
                ephemeral: true,
                interaction,
                embed: {
                    description: '`🟢` You have not been found in any servers',
                    color: Colours.GREEN,
                },
            });
        }

        const badServers: string[] = [];

        for (let i = 0, l = imports.length; i < l; ++i) {
            const x = imports[i];
            badServers.push(x.BadServer.name);
        }

        return sendEmbed({
            ephemeral: true,
            interaction,
            embed: {
                description: `\`🔴\` You were found in the following servers:\`\`\`${badServers.join(
                    '\n'
                )}\`\`\``,
                color: Colours.RED,
            },
        });
    },
});
