const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View helpful bot information!'),
    async execute(interaction) {

        const helpEmbed = new EmbedBuilder()
        .setColor(0xe3000b)
        .setTitle("Help")
        .setAuthor({ name: 'CTFTime', iconURL: 'https://play-lh.googleusercontent.com/uiZnC5tIBpejW942OXct4smbaHmSowdT5tLSi28Oeb2_pMLPCL-VJqdGIH6ZO3A951M', url: 'https://ctftime.org' })
        .setFooter({ text: 'This bot is unofficial, and unaffiliated with CTFTime' });

        const commands = [];
        const commandPath = __dirname

        // grab list of every command
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
        }
        // list out commands in embed fields
        // constraint: if ever exceeding 25 commands the embed will break due to maximum field limit
        commands.forEach(command => {
            let optionString ="";
            command['options'].forEach(option => {
                optionString += `{${option['name']}}: ${option['description']}\n`;
            });
            helpEmbed.addFields({
                name: command['name'],
                value: `${command['description']}\n${optionString}`
            })
        });

        await interaction.reply({ embeds: [helpEmbed] })
    },
};
