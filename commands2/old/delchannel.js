module.exports = {
    name: 'delchannel',
    alias:['delch'],
    description: `deletes a channel
               usage: s.delchannel <channel name>
                eg. s.channel 99999`,
    run(message, args, client) {
        try {
        args.forEach(arg => {
            
               let channel = message.guild.channels.cache.find(channel => channel.name == arg);
            
            channel.delete();
                
        })
        } catch (error) {
            throw(error)
        }
        
        
        
        
    }
}