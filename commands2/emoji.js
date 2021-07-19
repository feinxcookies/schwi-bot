module.exports = {
    name: 'emoji',
    alias:['emoji'],
    description: "lists emojis",
    usage: "",
    example: "",
    init(){},
    run(message, args, client) {
        const e = message.guild.emojis;
        var m = '';

        e.cache.forEach(element => {
            var str = e.resolveIdentifier(element);
            if (m.length + str.length + 3> 2000) {
                message.channel.send(m);
                m = '';
            }
            if (element.animated) {
                m += `<${str}>`;
            } else {
            m += `<:${str}>`;
            }
            //m+= element;
            //message.channel.send(`<${e.resolveIdentifier(element)}>`);
            //:${e.resolveID(element)}
            //message.channel.send(`${element}`);
            
            
        });
        message.channel.send(m);
    }
}
