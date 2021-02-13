module.exports = {
    name: 'reload',
    alias:['r'],
    description: '',
    run(message, args, client) {
        if (args.length == 0) {
            for (const file of client.commandFiles) {
                delete require.cache[require.resolve(`../${client.commanddir}/${file}`)];
                const command = require(`../${client.commanddir}/${file}`);
                client.commands.set(command.name, command);
                // adds everything in the alias field of a command to the map
                command.alias.forEach((val, _) => {client.aliasMap[val] = command.name});
                // adds the base name as well
                client.aliasMap[command.name] = command.name;
              }

        }
        for (arg of args) {
            // args are filenames
             delete require.cache[require.resolve(`../${client.commanddir}/${arg}`)];
            const command = require(`../${client.commanddir}/${arg}`);
            // collection that holds name=>filename
            client.commands.set(command.name, command);
            // alias map that holds alias=> name
            command.alias.forEach((val, _) => {client.aliasMap[val] = command.name});
            client.aliasMap[command.name] = command.name;
            message.channel.send(`reloaded file: ${arg}`);
        }
        
        message.channel.send("reloading done");
    }
}