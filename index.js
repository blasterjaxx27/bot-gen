const { Client, Intents } = require('discord.js');

const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const fs = require('fs');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v9');

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    commands.push(command.data.toJSON());

}

const clientId = 'YOUR_CLIENT_ID'; // Remplacez YOUR_CLIENT_ID par l'ID de votre bot

const rest = new REST({ version: '9' }).setToken(token);

(async () => {

    try {

        console.log('Started refreshing application (/) commands.');

        await rest.put(

            Routes.applicationGuildCommands(clientId, 'YOUR_GUILD_ID'), // Remplacez YOUR_GUILD_ID par l'ID de votre serveur

            { body: commands },

        );

        console.log('Successfully reloaded application (/) commands.');

    } catch (error) {

        console.error(error);

    }

})();

client.once('ready', () => {

    console.log('Ready!');

});

client.on('interactionCreate', async interaction => {
    
    
    
       

   



    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {

        const command = require(`./commands/${commandName}`);

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de cette commande.', ephemeral: true });
        
        
    
    }

});

client.login(token);
