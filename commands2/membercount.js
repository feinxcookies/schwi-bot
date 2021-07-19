module.exports = {
    name: 'membercount',
    alias:['membercount'],
    description: "self explanatory",
    usage: "membercount",
    example: "",
    init(){},
    run(message, args, client, inputCommand) {
        message.channel.send(message.guild.memberCount + " members in this server");
    }
}