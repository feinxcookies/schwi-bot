

module.exports = {
    name: 'invite',
    alias:['inv', 'link'],
    description: "gets the invite",
    usage: "inv",
    example: "",
    run(message, args, client) {
        const invite = "https://discord.com/oauth2/authorize?client_id=422684380100689921&scope=bot&permissions=0"
        message.channel.send(invite);
        
    }
}
