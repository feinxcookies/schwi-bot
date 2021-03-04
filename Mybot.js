const Discord = require("discord.js");
const client = new Discord.Client();

client.config = require("./config.json"); // contains  discord prefix
const fs = require("fs"); // file system kek
require('dotenv').config();
const secretmessage = "wow! a security flaw";

// init event
client.on("ready", () => {
// init alias => command file mapping

  client.aliasMap = new Map();
  client.commands = new Discord.Collection();
  client.commanddir = './commands2';
  client.commandFiles = fs.readdirSync(client.commanddir).filter(file => file.endsWith('.js'));
  for (const file of client.commandFiles) {
    const file_dir =  `${client.commanddir}/${file}`;

    fs.watchFile(file_dir,{interval:1000}, () => {
      
      delete require.cache[require.resolve(file_dir)];
      console.log(file_dir);
      const command = require(file_dir);
      client.commands.set(command.name, command);
      // adds everything in the alias field of a command to the map
      
      command.alias.forEach((val, _) => {client.aliasMap[val] = command.name});
      // adds the base name as well
      client.aliasMap[command.name] = command.name;
    }); 

    const command = require(file_dir);
    client.commands.set(command.name, command);
    // adds everything in the alias field of a command to the map
    command.alias.forEach((val, _) => {client.aliasMap[val] = command.name});
    // adds the base name as well
    client.aliasMap[command.name] = command.name;
  }

  console.log(client.aliasMap);
  client.user.setStatus(`${client.config.prefix}help`)
  console.log("I am ready!");
});




// message event
// message is a discord.js variable
client.on("message", (message) => {
  if (!message.content.startsWith(client.config.prefix)) return; // check prefix
  if (message.author.bot) {
    if (message.author.id == 422684380100689921) {
      message.channel.send("I don't talk to myself sorry");
      return;
    }
    message.channel.send("I don't talk to other bots, sorry");
    return;
  }
  //remove prefix
  const args = message.content.slice(client.config.prefix.length).toLowerCase().trim().split(/ +/g); // splice to remove prefix, then split by spaces
  
  const inputCommand = args.shift().toLowerCase();
  // s.<blank> case
  if (inputCommand.length == 0) {
    message.channel.send(`usage: ${prefix}<command> <args> \n for a list of commands use ${client.config.prefix}help`);
    return;
  }
  
  // try parse input command
  if (!client.commands.has(client.aliasMap[inputCommand])) return;

  try {
    client.commands.get(client.aliasMap[inputCommand]).run(message, args, client, inputCommand);
  } catch (error) {
    console.error(error);
   // message.channel.send(`ERROR: ${error}`);
  }
}


);

client.login(process.env.BOT_TOKEN);

