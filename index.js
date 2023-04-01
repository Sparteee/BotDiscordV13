const {Client, Collection, Message} = require('discord.js');
const client = new Client({intents : 513});
const { token , prefix , TokenTwitch,ClientIDTwitch} = require('./config.json');
const fs = require("fs");
const Axios = require("axios");


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
            if((message.channel.name != "general") && (message.channel.name != "test") && (message.channel.name != "😼")){
                let author = message.author.username
                let content = message.content
                let channel = message.channel.name
                let msgsend = await message.channel.send(`${author}:\`\`\`${channel}\n${content} \`\`\``)
                message.delete()
            }
        }
})

client.login(token);