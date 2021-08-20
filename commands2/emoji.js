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

        e.cache.forEach((element, i) => {
            var str = e.resolveIdentifier(element);
            if (i % 24 == 0 ) {
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
