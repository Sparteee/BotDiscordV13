const {Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client({intents : 513});
const { token , prefix } = require('./config.local.json');
const fs = require("fs");
const axios = require("axios");
const ical = require('node-ical');
const cron = require('node-cron');
const login = 'rvictor'
const urlICS = `https://apps.univ-lr.fr/cgi-bin/WebObjects/ServeurPlanning.woa/wa/ics?login=${login}`;


async function getICalData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier iCalendar:', error.message);
        throw error;
    }
}

// Fonction principale
async function main() {
    try {
        // Récupérer les données iCalendar depuis l'URL
        const icalData = await getICalData(urlICS);

        // Parser les données iCalendar
        const parsedData = ical.parseICS(icalData);

        // Transformer les événements en tableau de données
        const eventsArray = [];

        for (const key in parsedData) {
            if (parsedData.hasOwnProperty(key)) {
                const event = parsedData[key];
                if (event.type === 'VEVENT') {
                    // Ajouter les propriétés d'événement nécessaires au tableau
                    eventsArray.push({
                        summary: event.summary,
                        start: event.start,
                        end: event.end,
                        location: event.location
                        
                    });
                }
            }
        }

        // Afficher le tableau de données
        // console.log(eventsArray);

        const eventsToday = eventsArray.filter(event => {
            const today = new Date(Date.now());
            return event.start.toDateString() === today.toDateString();
        }).sort((a, b) => a.start - b.start);

        const channelID = '947710612627128361'
        const channel = client.channels.cache.get(channelID);
        const userID = '166933423406055437'

        if(channel) {
           // const embed = new Discord.MessageEmbed().setTitle(`EDT du ${new Date(Date.now()).toLocaleDateString()}`)

            const embed = new MessageEmbed()
            .setTitle(`EDT -- ${new Date(Date.now()).toLocaleDateString('fr-FR')}\n\n`)
            .setColor('#ff8e01')
            eventsToday.forEach(event => {
                test.addField(
                    `${event.summary}\n`, 
                    `De ${event.start.toLocaleTimeString('fr-FR')} à ${event.end.toLocaleTimeString('fr-FR')}\n\n`
                )
            });
            embed.setTimestamp()
           // channel.send(embed);

           channel.send({ embeds: [embed] });
        }



    } catch (error) {
        console.error('Une erreur est survenue:', error.message);
    }
}


client.on('ready' , () =>{
    console.log("Ready / Prêt à l'utilisation ! ")

    const acti = ['Dems 🖖','By Sparte','dév']
    
    const typeacti = ['LISTENING','WATCHING','PLAYING']
    
    let i = 0
        setInterval(() => {
            client.user.setPresence({
                status : 'dnd',
                activities : [{
                    name : acti[i],
                    type : typeacti[i]
                }]
            })
            i = ++i % acti.length
        }, 3000)
        
    cron.schedule('0 9 * * *', () => {
        main();
    });
})

client.commands = new Collection();

const commandsFiles = fs.readdirSync('./commands').filter( file => file.endsWith('.js'));
 // console.log(commandsFiles)


for( const file of commandsFiles ){
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
}

client.on('messageCreate', async message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return
    if(message.channel.type == "DM")return;
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(prefix)) return
    const command = client.commands.get(commandName.slice(prefix.length))
    if(!command){
        let noExist = await message.reply("Cette commande n'existe pas !")
        setTimeout(() => {
            noExist.delete()
        }, 5000);
        return true
    }
    command.execute(message, args, client)

});

client.on('messageCreate', async message =>{
    
        if(!message.author.bot){
            if((message.channel.name != "general") && (message.channel.name != "test") && (message.channel.name != "😼") && (message.channel.name != "message")){
                let author = message.author.username
                let content = message.content
                let channel = message.channel.name
                let msgsend = await message.channel.send(`${author}:\`\`\`${channel}\n${content} \`\`\``)
                message.delete()
            }
        }
})

client.login(token);