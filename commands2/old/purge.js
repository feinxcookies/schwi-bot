
module.exports = {
    name: 'purge',
    alias:['purge'],
    description: "purges everthing",
    usage: "purge <channel>",
    example: "fenixcookies: 'pls dont yeet me admin'!\n admin: 'yeet @fenixcookies'",
    run(message, args, client) {
        message.channel.messages.fetch()
        .then(messages => {
            var i = 0;
            const m = message.channel.send(`deleted 0 messages`);
            messages.forEach(message => {message.delete().then(()=> m.then().edit(`deleted ${i++} messages`)).catch(console.error)});
        })
        .catch(console.error);
    }
}