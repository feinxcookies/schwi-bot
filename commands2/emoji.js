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
        var j = 0;
        e.cache.forEach((element) => {
            var str = e.resolveIdentifier(element);
            if (j % 24 == 0 ) {
                message.channel.send(m);
                j = 0;
                m = '';
            } else {j++};
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
