module.exports = {
    name: 'help',
    alias:['h'],
    description: "gives help",
    usage: "help <command>",
    dm:true,
    init(){},
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
                var usg;
                if (typeof(command.usage) == "string") {
                    usg = client.config.prefix + command.usage + "\n";
                } else {
                    usg = "\n"+ Array.from(command.usage, (e) => "    " + client.config.prefix + e + "\n").join(""); 
                }
                m += "  usage: " + usg;
            }
        }
        m+= "```";
        message.channel.send(m).catch(e => console.log(e));    
    }
}
