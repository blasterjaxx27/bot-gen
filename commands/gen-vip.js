const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

const fs = require('fs');

const path = require('path');

const allowedChannelId = '1233885460992888852';

const cooldownTime = 5 * 60 * 1000; // 5 minutes en millisecondes

const userCooldowns = {};

module.exports = {

    data: new SlashCommandBuilder()

        .setName('gen-vip')

        .setDescription('GÃ©nÃ¨re un compte VIP Ã  partir d\'un service spÃ©cifiÃ©.')

        .addStringOption(option =>

            option.setName('service')

                .setDescription('Le service pour lequel vous souhaitez gÃ©nÃ©rer un compte.')

                .setRequired(true)

                .addChoices(

                    { name: 'Crunchyroll', value: 'crunchyroll' },

                    { name: 'Netflix', value: 'netflix' },

                    { name: 'Disney+', value: 'disney+' },

                    { name: 'Nitro Gen Tool', value: 'nitro-tool' },

                    { name: 'TunnelBear', value: 'tunnelbear' },

                    { name: 'SFR', value: 'sfr' },

                    { name: 'Call of Duty', value: 'call-of-duty' },

                    { name: 'Valorant', value: 'valorant' },

                    { name: 'ADN', value: 'adn' },

                    { name: 'UFC', value: 'ufc' },

                    { name: 'Canal+', value: 'canal+' },

                    { name: 'IPVanish', value: 'ipvanish' },

                    { name: 'Molotov', value: 'molotov' },

                    { name: 'plex', value: 'plex' },

                    { name: 'dazn', value: 'dazn'},

                    { name: 'otacos', value: 'otacos'}

                )),

    async execute(interaction) {

        if (interaction.channelId !== allowedChannelId) {

            return await interaction.reply('Cette commande ne peut Ãªtre exÃ©cutÃ©e que dans un salon spÃ©cifique.');

        }

        const userId = interaction.user.id;

        const lastExecution = userCooldowns[userId];

        if (lastExecution && Date.now() - lastExecution < cooldownTime) {

            const remainingTime = Math.ceil((cooldownTime - (Date.now() - lastExecution)) / 60000); // Conversion en minutes

            return await interaction.reply(`Vous avez un temps de rÃ©cupÃ©ration de ${remainingTime} minutes ! - ${interaction.user.username}`);

        }

        const serviceName = interaction.options.getString('service');

        const fileName = path.join(__dirname, `../account/${serviceName.toLowerCase()}.txt`);

        if (!fs.existsSync(fileName)) {

            const embed = new MessageEmbed()

                .setTitle('Service Introuvable')

                .setDescription(`DÃ©solÃ©, le service ${serviceName} est introuvable.`)

                .setImage('https://i.imgur.com/k1vIcAy.gif')

                .setColor('#FF0000');

            return await interaction.reply({ embeds: [embed] });

        }

        const fileContent = fs.readFileSync(fileName, 'utf8').trim();

        if (fileContent === '') {

            const embed = new MessageEmbed()

                .setTitle('Rupture de Stock')

                .setDescription(`DÃ©solÃ©, il n'y a plus de stock disponible pour le service ${serviceName}.`)

                .setImage('https://i.imgur.com/wUPoOnm.gif')

                .setColor('#FF0000');

            return await interaction.reply({ embeds: [embed] });

        }

        const accounts = fileContent.split('\n');

        const account = accounts.shift();

        fs.writeFileSync(fileName, accounts.join('\n'));

        try {

            await interaction.user.send(`Voici les informations de votre compte ${serviceName} :\n${account}`);

        } catch (error) {

            console.error('Erreur lors de l\'envoi du message privÃ© :', error);

            return await interaction.reply('Impossible de vous envoyer le compte en message privÃ©. Assurez-vous que vos paramÃ¨tres de confidentialitÃ© autorisent les messages privÃ©s.');

        }

        const embed = new MessageEmbed()

            .setTitle('Compte GÃ©nÃ©rÃ©!')

            .setDescription(`Votre compte ${serviceName} a Ã©tÃ© gÃ©nÃ©rÃ© avec succÃ¨s! Veuillez consulter vos messages privÃ©s.`)

            .setImage('https://i.imgur.com/rBOGW3d.gif')

            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed] });

        // Mettre Ã  jour le cooldown pour cet utilisateur

        userCooldowns[userId] = Date.now();

    },

};