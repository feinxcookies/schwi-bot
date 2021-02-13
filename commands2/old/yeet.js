
module.exports = {
    name: 'yeet',
    alias:['y', 'yeet'],
    description: "yeets a member from the guild for 1 day",
    usage: "yeet <user>",
    example: "fenixcookies: 'pls dont yeet me admin'!\n admin: 'yeet @fenixcookies'",
    run(message, args, client) {
        
        
        let firstm = message.mentions.members.first();
        const guildmem = message.guild.member(firstm);
        guildmem.ban({days: 1, reason: 'lololol'});
        
    }
}
