module.exports = {
    name: 'admin',
    alias:['admin'],
    description: "self explanatory",
    usage: "admin add <role id> <members>",
    example: "",
    init(){},
    run(message, args, client, inputCommand) {
        if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) {
            message.channel.send('you must be an admin to use this command');
            return;
        }
        var subcmd = args.shift();
        
        switch (subcmd) {
            
            case 'rm':
               // console.log(message.guild.members.cache);
                message.guild.members.cache.each((mem) => {
                    console.log(mem.username);
                    if (args.includes(mem.username)) {
                        console.log(mem.username);
                        mem.edit({'roles':[]}); // basically wipe the roles
                    }

                });
                break;
            case 'add':
                var role = parseInt(args.shift());
                break;
            default:

                break;
        }
        
        
    }
}