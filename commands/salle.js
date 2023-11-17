const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js")
const axios = require('axios');
const ical = require('node-ical');

const salles = 
[
    {salle: '128', numero: 487},
    {salle: '133', numero: 492},
    {salle: '134', numero: 493},
    {salle: '135', numero: 494},
    {salle: '136', numero: 495},
    {salle: '137', numero: 496},
    {salle: 'SC8', numero: 2810},
    {salle: 'Info Trans 2', numero: 2807}
]
let sallesLibres = [];

async function getICalData(salNumero) {
    const urlSalle = `https://apps.univ-lr.fr/cgi-bin/WebObjects/ServeurPlanning.woa/wa/ics?salNumero=${salNumero}`;
    try {
        const response = await axios.get(urlSalle);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier iCalendar:', error.message);
        throw error;
    }
}
module.exports = {
    name : 'salle',
    description : 'Donne les salles disponibles pour les alternants',

    async execute(message , args , client){
        async function main(salles) {
            try {
                // Promesses pour toutes les requêtes iCalendar
                const icalPromises = salles.map(salle => getICalData(salle.numero));
        
                // Attendre que toutes les promesses soient résolues
                const icalDataArray = await Promise.all(icalPromises);
        
                // Traitement des données iCalendar pour chaque salle
                icalDataArray.forEach((icalData, index) => {
                    const salle = salles[index];
                    const parsedData = ical.parseICS(icalData);
                    const eventsArray = [];
        
                    for (const key in parsedData) {
                        if (parsedData.hasOwnProperty(key)) {
                            const event = parsedData[key];
                            if (event.type === 'VEVENT') {
                                eventsArray.push({
                                    summary: event.summary,
                                    start: event.start,
                                    end: event.end,
                                });
                            }
                        }
                    }
        
                    const eventsToday = eventsArray.filter(event => {
                        const today = new Date(Date.now());
                        return event.start.toDateString() === today.toDateString();
                    });
        
        
                    const isMorningFree = eventsToday.every(event => {
                        const eventStart = event.start.getHours() * 60 + event.start.getMinutes();
                        return eventStart < 8 * 60 || eventStart > 13 * 60;
                    });
        
                    const isAfternoonFree = eventsToday.every(event => {
                        const eventStart = event.start.getHours() * 60 + event.start.getMinutes();
                        return eventStart < 13 * 60 || eventStart > 17 * 60;
                    });
        
                    if (eventsToday.length === 0 || isMorningFree || isAfternoonFree) {
                        sallesLibres.push(
                            {
                                nom : salle.salle,
                                librLeMatin : isMorningFree,
                                libreLaprem : isAfternoonFree
                            }
                                );
                    }
                });
        
                const msg = new Discord.MessageEmbed()
                .setTitle('Salles libres')
                .setColor('#ff8e01')
                sallesLibres.forEach(salle => {
                    if(salle.libreLaprem && salle.librLeMatin){
                        msg.addField(
                            `${salle.nom}`, 
                            `Toute la journée / (9h30 - 16-30)\n\n`
                        )
                    }
                    if(salle.libreLaprem && salle.librLeMatin === false){
                        msg.addField(
                            `${salle.nom}`, 
                            `Après-midi / (13h30 - 16h30)\n\n`
                        )

                    } 
                    if(salle.libreLaprem === false && salle.librLeMatin){
                        msg.addField(
                            `${salle.nom}`, 
                            `Matin / (9h30 - 12h30)\n\n`
                        )

                    }
                });
                msg.setTimestamp()
                message.channel.send({ embeds: [msg] });
               //  sallesLibres = [];

            } catch (error) {
                console.error('Une erreur est survenue:', error.message);
            }
        }

        main(salles);
    }
}