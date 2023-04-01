const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js")

module.exports = {
    name:'ping',
    description:'Ping Pong',
    execute(message,args, client){

        //console.log(message)
      const embed = new MessageEmbed()
        .setTitle('​🏓​ Pong !')
        .setThumbnail(client.user.displayAvatarURL({dynamic : true}))
        .addFields({name:'Latence' , value :`\`${client.ws.ping}\`ms`})
        .setFooter("Demandé par : " + message.member.user.tag , message.author.displayAvatarURL({dynamic: true}))


        message.channel.send({embeds : [embed]})
        
    }
}