module.exports = {
    name: 'membercount',
    alias:['membercount'],
    description: "self explanatory",
    usage: "membercount",
    example: "",
    run(message, args, client, inputCommand) {
        message.channel.send(message.guild.memberCount);
    }
}