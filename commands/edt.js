const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const ical = require('node-ical');

module.exports = {
  name: 'edt',
  description: 'Check your edt',
  async execute(message, args, client) {
    if (!args.length) {
      await message.reply('Please specify a user login!');
      return true;
    }
    if (args.length > 2) {
      await message.reply('Too much arguments!');
      return true;
    }
    const login = args[0];
    const delay = args[1] ?? null;
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

    async function main() {
      try {
        const icalData = await getICalData(urlICS);
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
                location: event.location,
            });
            }
          }
        }

        const channelID = '947710612627128361';
        const channel = client.channels.cache.get(channelID);
        if (channel) {
          if (!delay) {
            const eventsToday = eventsArray.filter((event) => {
              const today = new Date(Date.now());
              return event.start.toDateString() === today.toDateString();
            }).sort((a, b) => a.start - b.start);

            const msg = new MessageEmbed()
              .setTitle(`EDT -- ${new Date(Date.now()).toLocaleDateString('fr-FR')}\n\n`)
              .setColor('#ff8e01');
            eventsToday.forEach((event) => {
              msg.addField(
                `${event.summary}\n`,
                `De ${event.start.toLocaleTimeString('fr-FR')} à ${event.end.toLocaleTimeString('fr-FR')}\n\n`,
              );
            });
            msg.setTimestamp();
            channel.send({ embeds: [msg] });
          } else if (delay === 'next') {
            const eventsToday = eventsArray.filter((event) => {
              const today = new Date(Date.now() + 86400000);
              return event.start.toDateString() === today.toDateString();
            }).sort((a, b) => a.start - b.start);

            const msg = new MessageEmbed()
              .setTitle(`EDT -- ${new Date(Date.now() + 86400000).toLocaleDateString('fr-FR')}\n\n`)
              .setColor('#ff8e01');
            eventsToday.forEach((event) => {
              msg.addField(
                `${event.summary}\n`,
                `De ${event.start.toLocaleTimeString('fr-FR')} à ${event.end.toLocaleTimeString('fr-FR')}\n\n`,
              );
            });
            msg.setTimestamp();
            channel.send({ embeds: [msg] });
          } else if (delay === 'prev') {
            const eventsToday = eventsArray.filter((event) => {
              const today = new Date(Date.now() - 86400000);
              return event.start.toDateString() === today.toDateString();
            }).sort((a, b) => a.start - b.start);
            const msg = new MessageEmbed()
              .setTitle(`EDT -- ${new Date(Date.now() - 86400000).toLocaleDateString('fr-FR')}\n\n`)
              .setColor('#ff8e01');
            eventsToday.forEach((event) => {
              msg.addField(
                `${event.summary}\n`,
                `De ${event.start.toLocaleTimeString('fr-FR')} à ${event.end.toLocaleTimeString('fr-FR')}\n\n`,
              );
            });
            msg.setTimestamp();
            channel.send({ embeds: [msg] });
          }
        }
      } catch (error) {
        console.error('Une erreur est survenue:', error.message);
      }
    }
    main();
    return true;
  },
};
