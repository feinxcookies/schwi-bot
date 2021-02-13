module.exports = {
    name: 'send',
    alias:['send'],
    description: "sends what you type to it",
    usage: "",
    example: "",
    run(message, args, client, inputCommand) {

        
        if (args[0] == "") return;
        let m1 = '';
        m1 += message.content.slice(client.config.prefix.length + inputCommand.length).trim();
        m1 += '';
        message.channel.send(m1)
        //.then(m2 => message.delete().then(m2.delete()));
    }
}