const Discord = require('discord.js')
const { MessageEmbed } = require("discord.js")
const {Translate} = require('@google-cloud/translate').v2;
const { keyAPI } = require('../config.json')


module.exports = {
    name:'en',
    description:'Traduction en anglais',
    async execute(message,args, client){
        const projectId = "projetdiscord-360423"
        let UserMessage = await message.author.username
        let msg = await message
        
        // console.log(UserMessage)
        

        const query = args.join(" ")
        if(!args.length){
            let noTranslate = await message.reply("Please, specify the text you want to translate into English!")
            setTimeout(() => {
                noTranslate.delete()
            }, 5000);
            return true;
        }
        const traduction = new Translate({projectId, key : keyAPI})
        const target = 'en'

        const traduit = await traduction.translate(query , target)
        message.channel.send(`${UserMessage} : ${traduit[0]}`)

        msg.delete()
    }
}