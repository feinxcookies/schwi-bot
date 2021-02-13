module.exports = {
    name: 'edits',
    alias:['e'],
    description: "edits",
    usage: "",
    example: "",
    run(message, args, client) {
        message.channel.send("0").then( (m) => {
            for (var i = 1; i < args[0]; i++) {
                m.edit(i);
            }
            


        })

        
    }
}
