const Discord = require('discord.js')
const { description } = require('./help')

module.exports = {
    name : 'infoserv',
    description : 'Donne des informations du serveur',

    async execute(message , args , client){
        const embedinfo = new Discord.MessageEmbed()
		.setColor('#ea061f')
		.setTitle('**Informations du serveur**')
		.addFields(
			{name : 'Nom du serveur :' , value : `${message.guild.name}`},
			{name : ' Date du création du serveur : ' , value : `${message.guild.createdAt}`},
			{name : 'Nombre de membres :' , value : `${message.guild.memberCount}`},
			{name : 'Propriétaire de ce serveur : ' , value : `${message.guild.owner}`}

		)
		.setTimestamp(message.guild.createdAt)

		let msginfo = await message.channel.send({embeds : [embedinfo]})
        setTimeout(() => {
            msginfo.delete()
        }, 15000);
    }
}