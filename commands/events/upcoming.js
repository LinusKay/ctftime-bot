const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { request } = require('undici');
const { convertDateReadable, timeBetween, convertDateUTCToAEDT, convertDMYEpoch } = require('../../modules/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('upcoming')
        .setDescription('View upcoming CTF events!')
		.addStringOption(option => 
			option.setName('startdate')
				.setDescription('Starting date of search (dd/mm/yyyy, dd-mm-yyyy), default: today'))
		.addStringOption(option => 
			option.setName('enddate')
				.setDescription('Ending date of search (dd/mm/yyyy, dd-mm-yyyy), default: next week today'))
		.addIntegerOption(option => 
			option.setName('results')
				.setDescription('Number of results to show (max 25), default 10')),
    async execute(interaction) {
        await interaction.deferReply();

		// Define result limit
		// Only 25 embed fields allowed by Discord
		const maximumResults = 25;
		let resultCount = interaction.options.getInteger('results') || 10;
		resultCount = Math.min(resultCount, maximumResults);
		console.log(resultCount);

		// Parse command arguments (dd/mm/yyyy or dd-mm-yyyy)
		const searchStartOption = convertDMYEpoch(interaction.options.getString('startdate'));
		const searchEndOption = convertDMYEpoch(interaction.options.getString('enddate'));

        // Define variables for today, next week, and result limit
        const today = new Date();
        const todayTimestamp = Math.floor(today.getTime() / 1000);

        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const nextWeekTimestamp = Math.floor(nextWeek.getTime() / 1000);

		// If dates input as command arguments use, otherwise default to now and next week
		const searchStart = searchStartOption || todayTimestamp;
		const searchEnd = searchEndOption || nextWeekTimestamp
		const searchStartReadable = convertDateReadable(new Date(searchStart));
		const searchEndReadable = convertDateReadable(new Date(searchEnd));

        // Construct the URL for the API request
        const apiUrl = `https://ctftime.org/api/v1/events/?limit=${resultCount}&start=${searchStart}&finish=${searchEnd}`;

        try {
			// Make the API request
			const response = await request(apiUrl);
			const responseBody = await response.body.json();

			const responseEmbed = new EmbedBuilder()
				.setColor(0xe3000b)
				.setTitle(`This week's events (${searchStartReadable} - ${searchEndReadable})`)
				.setAuthor({ name: 'CTFTime', iconURL: 'https://play-lh.googleusercontent.com/uiZnC5tIBpejW942OXct4smbaHmSowdT5tLSi28Oeb2_pMLPCL-VJqdGIH6ZO3A951M', url: 'https://ctftime.org' })
				.setFooter({ text: 'Read about a specific event with /eventinfo {eventid}, eg: /eventinfo 1954' });

			responseBody.forEach(event => {
				let { id, title, url, ctftime_url, start, finish, description, organizers } = event;

				organizers = organizers[0]['name'];

				const descriptionMaxChars = 64;
				const truncatedDescription = description.length > descriptionMaxChars ? description.substring(0, descriptionMaxChars) + '...' : description;

				const startDate = convertDateUTCToAEDT(new Date(start));
				const finishDate = convertDateUTCToAEDT(new Date(finish));
				const startReadable = convertDateReadable(startDate, true);
				const finishReadable = convertDateReadable(finishDate, true);

				const { days, hours } = timeBetween(today, startDate);

				responseEmbed.addFields({ 
					name: `${organizers}: ${title}`,
					value: `${startReadable} - ${finishReadable}\n(in ${days} days, ${hours} hours)\n[Event Link](${url}) | [CTFTime Page](${ctftime_url}) | *event id: #${id}*`
				});
			});

            // Process the response and send it to the Discord bot
            await interaction.editReply({ embeds: [responseEmbed] });

        } catch (error) {
            console.error('Error fetching CTF events:', error);
            await interaction.editReply('There was an error fetching CTF events.');
        }
    },
};
