

module.exports = {
    name: 'dont use this command',
    alias:['channel'],
    description: `creates channels based on args given
               usage: s.createchannel
                eg. s.channel 99999`,
    run(message, args, client) {
        
        message.guild.channels.create('numbers', {type: 'category'})
        .then( (value) => {
                
                for (let i = 0; i < args[0]; i++) {
                    message.guild.channels.create(`${i}`, {parent: value});
                }
                message.channel.send(`create ${args[0]} channels`);   
            }
        )
        
        
        
    }
}