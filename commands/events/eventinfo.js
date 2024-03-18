const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const { convertDateReadable, timeBetween, convertDateUTCToAEDT } = require('../../modules/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eventinfo')
        .setDescription('View details about a specific CTF event!')
        .addIntegerOption(option =>
            option.setName('eventid')
                .setDescription('The event ID to look up.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const eventId = interaction.options.getInteger('eventid');

		const today = new Date()

        const apiUrl = `https://ctftime.org/api/v1/events/${eventId}/`;

        try {
            // Make the API request
			const response = await request(apiUrl);
			const responseBody = await response.body.json();

            let { title, url, ctftime_url, start, finish, description, organizers } = responseBody;

            organizers = organizers[0]['name'];

            const descriptionMaxChars = 64000;
            if (description.length > descriptionMaxChars) {
                description = description.substring(0, descriptionMaxChars) + '...';
            }

            const startDate = convertDateUTCToAEDT(new Date(start));
            const finishDate = convertDateUTCToAEDT(new Date(finish));
            const startReadable = convertDateReadable(startDate, true);
            const finishReadable = convertDateReadable(finishDate, true);

            const { days, hours } = timeBetween(today, convertDateUTCToAEDT(startDate))

			const responseEmbed = new EmbedBuilder()
				.setColor(0xe3000b)
				.setTitle(`CTFTime: ${title}`)
                .setURL(url)
                .setAuthor({ name: 'CTFTime', iconURL: 'https://play-lh.googleusercontent.com/uiZnC5tIBpejW942OXct4smbaHmSowdT5tLSi28Oeb2_pMLPCL-VJqdGIH6ZO3A951M', url: 'https://ctftime.org' })
                .setDescription(description)
                .setFooter({ text: 'See this week\s events with /upcoming'})
                
            responseEmbed.addFields({ 
                name: `Time`,
                value: `
                ${startReadable} - ${finishReadable}
                (in ${days} days, ${hours} hours)`
            });
            responseEmbed.addFields({ 
                name: `Event Site`,
                value: `[Event Link](${url})`,
                inline: true
            });
            responseEmbed.addFields({ 
                name: `Event Site`,
                value: `[CTFTime Page](${ctftime_url})`,
                inline: true
            });


			// Process the response and send it to the Discord bot
			await interaction.editReply({ embeds: [responseEmbed] });

        } catch (error) {
            console.error('Error fetching CTF events:', error);
            await interaction.editReply('There was an error fetching CTF events.');
        }
    },
};
