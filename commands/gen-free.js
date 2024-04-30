const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

const fs = require('fs');

const path = require('path');

const allowedChannelId = '1232380444910293033';

const cooldownTime = 30 * 60 * 1000; // 30 minutes en millisecondes

const userCooldowns = {};

module.exports = {

    data: new SlashCommandBuilder()

        .setName('gen-free')

        .setDescription('Génère un compte a  partir d\'un service spécifié')

        .addStringOption(option =>

            option.setName('service')

                .setDescription('Le service pour lequel vous souhaitez gÃ©nÃ©rer un compte.')

                .setRequired(true)

                .addChoices(

                    { name: 'SFR', value: 'sfr' },

                    { name: 'UFC', value: 'ufc' },

                    { name: 'Disney+', value: 'disney+' }

                )),

    async execute(interaction) {

        if (interaction.channelId !== allowedChannelId) {

            return await interaction.reply('Cette commande ne peut Ãªtre exÃ©cutÃ©e que dans un salon spÃ©cifique.');

        }

        const userId = interaction.user.id;

        const lastExecution = userCooldowns[userId];

        if (lastExecution && Date.now() - lastExecution < cooldownTime) {

            const remainingTime = Math.ceil((cooldownTime - (Date.now() - lastExecution)) / 60000); // Conversion en minutes

            return await interaction.reply(`Vous avez un temps de récupération de ${remainingTime} minutes ! - ${interaction.user.username}`);

        }

        const serviceName = interaction.options.getString('service');

        const fileName = path.join(__dirname, `../account/${serviceName.toLowerCase()}.txt`);

        if (!fs.existsSync(fileName)) {

            const embed = new MessageEmbed()

                .setTitle('Service Introuvable')

                .setDescription(`Desolé, le service ${serviceName} est introuvable.`)

                .setImage('https://i.imgur.com/k1vIcAy.gif')

                .setColor('#FF0000');

            return await interaction.reply({ embeds: [embed] });

        }

        const fileContent = fs.readFileSync(fileName, 'utf8').trim();

        if (fileContent === '') {

            const embed = new MessageEmbed()

                .setTitle('Rupture de Stock')

                .setDescription(`desolé, il n'y a plus de stock disponible pour le service ${serviceName}.`)

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

            .setDescription(`Votre compte ${serviceName} a été généré avec succès ! Veuillez consulter vos messages privé.`)

            .setImage('https://i.imgur.com/rBOGW3d.gif')

            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed] });

        // Mettre Ã  jour le cooldown pour cet utilisateur

        userCooldowns[userId] = Date.now();

    },

};