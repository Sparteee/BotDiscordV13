const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js")
const axios = require('axios');
const ical = require('node-ical');


module.exports = {
    name:'edt',
    description:'Check your edt',
    async execute(message,args, client){
        if(!args.length){
            let noUser = await message.reply("Please, specify your name!")
            return true;
        }
        if(args.length > 2) {
            let tooMuchArgs = await message.reply("Too much arguments!")
            return true;
        }

        const login = args[0];
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
        
                    const test = new MessageEmbed()
                    .setTitle(`EDT -- ${new Date(Date.now()).toLocaleDateString()}\n\n`)
                    .setColor('#ff8e01')
                    eventsToday.forEach(event => {
                        test.addField(
                            `${event.summary}\n`, 
                            `De ${event.start.toLocaleTimeString()} à ${event.end.toLocaleTimeString()}\n\n`
                        )
                    });
                    test.setTimestamp()
                   // channel.send(embed);
        
                   channel.send({ embeds: [test] });
                }
        
        
        
            } catch (error) {
                console.error('Une erreur est survenue:', error.message);
            }
        }

        main();
    }
}