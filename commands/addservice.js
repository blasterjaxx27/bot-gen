const { SlashCommandBuilder } = require('@discordjs/builders');

const fs = require('fs');

module.exports = {

    data: new SlashCommandBuilder()

        .setName('addservice')

        .setDescription('Crée un fichier texte pour un nouveau service.')

        .addStringOption(option =>

            option.setName('service')

                .setDescription('Le nom du nouveau service.')

                .setRequired(true)),

    async execute(interaction) {

        if (!interaction.inGuild()) {

            return await interaction.reply('Cette commande ne peut être exécutée que dans un serveur.');

        }

        const serviceName = interaction.options.getString('service');

        const fileName = `./account/${serviceName}.txt`;

        // Vérifier si le fichier du service existe déjà

        if (fs.existsSync(fileName)) {

            return await interaction.reply('Ce service existe déjà.');

        }

        // Créer le fichier pour le nouveau service

        fs.writeFileSync(fileName, '');

        await interaction.reply(`Le service "${serviceName}" a été créé avec succès.`);

    },

};
