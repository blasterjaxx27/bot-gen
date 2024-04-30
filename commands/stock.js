const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

const { MessageEmbed } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()

        .setName('stock')

        .setDescription('Affiche le stock de tous les services.'),

    async execute(interaction) {

        if (!interaction.inGuild()) {

            return await interaction.reply('Cette commande ne peut être exécutée que dans un serveur.');

        }

        // Récupérer la liste des fichiers dans le dossier account

        const files = fs.readdirSync('./account', 'utf-8');

        // Créer un nouvel embed

        const embed = new MessageEmbed()

            .setTitle('Stock de tous les services');

        // Parcourir tous les fichiers pour obtenir le stock de chaque service

        files.forEach(file => {

            const serviceName = file.split('.')[0];

            const filePath = `./account/${file}`;

            const fileContent = fs.readFileSync(filePath, 'utf-8');

            const accountsCount = fileContent.trim() ? fileContent.trim().split('\n').length : 0;

            embed.addField(serviceName, `${accountsCount} compte(s)`, true);

        });

        // Envoyer l'embed avec le stock de tous les services

        await interaction.reply({ embeds: [embed] });

    },

};
