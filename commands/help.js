const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js")

module.exports = {
    name : 'help' , 
    description : 'Affiche le menu help',

    async execute(message , args , client){
        const embedhelp = new Discord.MessageEmbed()
		.setColor('#ff8e01')
		.setTitle('----**Toutes les commandes !**----')
		.addFields(
			{name : 'Commande Clear :' , value : '`!clear <2-99>`'},
            {name : 'Commande Traduction :' , value : '`!<langueatraduire> <messageatraduire>`'},
            {name : 'Langue possible à traduire :' , value : '`!en , !fr , !es , !de , !ru`'},
			{name : 'Afficher les informations du serveur :' , value : '`!infoserv`'},
		)
		.setFooter("Demandé par  " + message.member.user.tag , message.author.displayAvatarURL({dynamic : true}))
	
		let msghelp = await message.channel.send({embeds : [embedhelp]})
        

    }

}