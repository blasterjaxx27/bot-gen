const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

const fetch = require('node-fetch');

// URL du webhook pour envoyer l'alerte

const webhookUrl = 'https://discord.com/api/webhooks/1229492225264586813/6364Ksp9jN3VwrYnc8Qp9C2DSvTICl4itXCBSmz-L23WCSLU6AiWxkoWOFgj1BLhSaMn';

module.exports = {

    data: new SlashCommandBuilder()

        .setName('restock')

        .setDescription('Restocke un service avec de nouveaux comptes.')

        .addStringOption(option =>

            option.setName('service')

                .setDescription('Le service à restocker.')

                .setRequired(true))

        .addStringOption(option =>

            option.setName('comptes')

                .setDescription('Les nouveaux comptes à ajouter, séparés par des espaces.')

                .setRequired(true)),

    async execute(interaction) {

        if (!interaction.inGuild()) {

            return await interaction.reply('Cette commande ne peut être exécutée que dans un serveur.');

        }

        const serviceName = interaction.options.getString('service');

        const fileName = `./account/${serviceName}.txt`;

        const newAccountsList = interaction.options.getString('comptes').split(' ');

        // Vérifier si le fichier du service existe

        if (!fs.existsSync(fileName)) {

            return await interaction.reply('Ce service n\'existe pas.');

        }

        // Ajouter les nouveaux comptes dans le fichier

        const formattedAccounts = newAccountsList.map(account => account.trim()).filter(account => account !== '');

        fs.appendFileSync(fileName, formattedAccounts.join('\n') + '\n');

        // Envoyer une alerte par webhook

        const plural = formattedAccounts.length > 1 ? 's' : ''; // Pour gérer le pluriel

        const webhookData = {

            content: `Le service "${serviceName}" a été restocké avec ${formattedAccounts.length} nouveau${plural} compte${plural}.`,

        };

        try {

            await fetch(webhookUrl, {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json',

                },

                body: JSON.stringify(webhookData),

            });

        } catch (error) {

            console.error('Erreur lors de l\'envoi de l\'alerte par webhook :', error);

        }

        await interaction.reply(`Le service "${serviceName}" a été restocké avec succès.`);

    },

};
