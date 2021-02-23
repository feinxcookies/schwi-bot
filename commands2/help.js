module.exports = {
    name: 'help',
    alias:['h', 'hlep'],
    description: "gives help",
    usage: "help <command>",
    example: "help dice",
    run(message, args, client) {
        var m = "```ini\n";
        
        if (args.length == 0 ) {
          //  console.log(client.commands);
          m += "[COMMANDS] use: " + client.config.prefix + "help <command>, to get more info \n";
            for (const command of client.commands.values()) {
                if (command.description != '') {
                    m += "[" + command.name + "]\n";
                    m += "  description: " + command.description + "\n";
                    m += "  aliases: " + command.alias + "\n";
                }
            }
        } else {
           // m += "[COMMANDS] use: " + client.config.prefix + "help <command>, to get more info \n"
            for (const arg of args) {
                let command = client.commands.get(client.aliasMap[arg]);
                m += "[" + command.name + "]\n";
                m += "  aliases: " + command.alias + "\n";
                m += "  description: " + command.description + "\n";
                m += "  usage: " + client.config.prefix + command.usage + "\n";
                m += "  example: " + command.example + "\n";
            }
        }
        m+= "```";
        message.channel.send(m).catch(e => console.log(e));    
    }
}
