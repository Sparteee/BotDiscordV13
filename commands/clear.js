const Discord = require('discord.js')

module.exports = {
    name :'clear',
    description : 'Supprime les messages',


    execute(message , args , client){
        const embedclear = new Discord.MessageEmbed()
		.setFooter("Demandé par : " + message.member.user.tag , message.author.displayAvatarURL({dynamic: true}))
		if(!args.length){
			return message.channel.send({embeds : [embedclear.setDescription("**Précisez le nombre de messages que vous voulez supprimés !**")]})
		}
		if(!message.member.permissions.has('MANAGE_MESSAGES')){
			return message.channel.send({embeds : [embedclear.setDescription("**Vous n'avez pas la permission d'utiliser cette commande !**")]})
		}
		 else if (args[0] > 2 || args[0] < 100 ){
			message.channel.bulkDelete(args[0])
			message.channel.send({embeds : [embedclear.setDescription(`**${args[0]} messages supprimés !**`)]})
		}
    }
}
