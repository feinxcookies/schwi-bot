const Discord = require("discord.js");
const fs = require("fs"); // file system keke
const client = new Discord.Client();
client.config = require("./config.json"); // contains discord token and saves discord prefix
require('dotenv').config();
const disabled_channels = ["861190307282157580"];
// init event
client.on("ready", () => {
  // init alias => command file mapping
  client.aliasMap = new Map(); // takes an alias and gives a command name
  client.commands = new Discord.Collection(); // collection of commands
  client.commanddir = './commands2';
  client.commandFiles = fs.readdirSync(client.commanddir).filter(file => file.endsWith('.js'));
  for (const file of client.commandFiles) {
    const file_dir = `${client.commanddir}/${file}`;
    var command = require(file_dir);
    var init = ()=> {
      client.commands.set(command.name, command);
      command.alias.forEach((val, _) => { client.aliasMap[val] = command.name });
      client.aliasMap[command.name] = command.name;
      command.init();
    }
    fs.watchFile(file_dir, { interval: 1000 }, () => {
      delete require.cache[require.resolve(file_dir)];
      command = require(file_dir);
      console.log(file_dir);
      init();
    });
    init();
  }
  console.log(client.aliasMap);
  client.user.setActivity(`${client.config.prefix}help`)
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (!message.content.toLowerCase().startsWith(client.config.prefix)) return; // check prefix
  if (message.author.bot) return;
  //remove prefix
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g); // splice to remove prefix, then split by spaces

  const inputCommand = args.shift().toLowerCase();
  // s.<blank> case
  if (inputCommand.length == 0) {
    message.channel.send(`usage: ${client.config.prefix}\`command\` \`args\` \n for a list of commands use ${client.config.prefix}help\``);
    return;
  }
  // check input command exists

  if (!client.commands.has(client.aliasMap[inputCommand])) return;
  const cmdFile = client.commands.get(client.aliasMap[inputCommand]);
   //check if command is enabled for given channel
   if (disabled_channels.includes(message.channel.id) && 
      (cmdFile.allowedChannels == null || !cmdFile.allowedChannels.includes(message.channel.id)) ) return;


  if (cmdFile.dm != true && message.channel.type == "dm") return;
  if (args[0] == "help") {
    client.commands.get(client.aliasMap['help']).run(message, [inputCommand], client);
    return;
  } 

    try {
      cmdFile.run(message, args, client, inputCommand);
    } catch (error) {
      console.error(error);
      // message.channel.send(`ERROR: ${error}`);
    }
  

}


);

client.login(process.env.BOT_TOKEN);
