module.exports = {
    name: 'dice',
    alias:['roll'],
    description: "rolls some amount of different sized dice",
    usage: `roll {<amount>d<dice size>}`,
    example: "s.roll 5d20 3d10 1d6",
    init(){},
    run(message, args, client) {
    // s.roll 1d20 2d4 etc
        // result: 2d20 :value, 2d4: value
        var m = "```results:\n";
        
        for(const arg of args) {
            var nums = arg.split('d');
            var sum = 0;
            m+= `   ${arg} =`
            for (let i = 0; i < nums[0]; i++) {
                let result = 1 + Math.floor(Math.random() * (nums[1]));
                sum += result;
                m+= ` ${result}`;
            }
            m += ` ,sum = ${sum}` + "\n";
        }
        m += "```";
        message.channel.send(m);

    }
}
