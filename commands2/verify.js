// CREDITS TO https://github.com/mtsev/seba
// google excel script + discord bot script adapted from there
const {getPad} = require('../modules/random.js');
const {GoogleSpreadsheet} = require('google-spreadsheet');
require('dotenv').config();
const seed = process.env.SEED;
const sheetDiscordColumn = 2;
const sheetVerifiedColumn = 6;
const verifiedRoleId = "552784361104343040";
var doc;
var sheet;
async function init () {
    doc = new GoogleSpreadsheet('12lhHiN9Xbh-lF2N2-ii9bD6YAUZ5wNqC0UYqH7xQlYU'); // the actual sheet is still private so ppl have to ask permission to view
        await doc.useServiceAccountAuth({client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY});
        await doc.loadInfo();
        console.log("opened sheet: " + doc.title);
        sheet = doc.sheetsByIndex[0];
        sheet.loadCells({startRowIndex: 0, endRowIndex: sheet.rowCount, startColumnIndex:0, endColumnIndex: sheet.columnCount});
}
async function run(message, args, client, inputCommand) {
    try {
    if (args.length == 1) {
        switch (args[0]) {
            case "setup":
                
                break;

            default:
                //s.verify <number>
                if (args[0]==getPad(message.author.tag.toLowerCase() + seed, 6)) {
                    // add to database
                    // scan discord names for a match
                    await doc.loadInfo();
                    for (var i = 1; i < sheet.rowCount; i++) {
                        if (sheet.getCell(i,sheetDiscordColumn).value == null) {
                            
                        }
                        else if (sheet.getCell(i,sheetDiscordColumn).value.toLowerCase() == message.author.tag.toLowerCase()) {
                            sheet.getCell(i,sheetVerifiedColumn).value = "true";
                            await sheet.saveUpdatedCells();
                            message.guild.member(message.author).roles.add(verifiedRoleId);
                            message.channel.send(`verification successful <@${message.author.id}>`)
                            message.delete({ timeout:7000});
                            return;
                        }
                    }
                    message.channel.send(`verification unsuccessful <@${message.author.id}>. please make sure your details are correct`)
                } else {
                    message.channel.send(`verification unsuccessful <@${message.author.id}>. please make sure your details are correct`)
                }
            break;
        }
        message.delete({ timeout:7000});
    } else {
        await message.channel.send(`Make sure to include the code you received from your email <@${message.author.id}>.`
        +"If you havent received such an email make sure you've filled out the form: https://forms.gle/3hhEv4Z9DDwVAKMJA"
        +" and check your student email (could be in junk mail) for further instructions")
        message.delete({ timeout:10000});
    }
    } catch (e){
        message.channel.send(`something went wrong, try again later`);
        message.delete({ timeout:70000});
    }
}

module.exports = {
    name: 'verify',
    alias:['verify'],
    description: "used to verify members, check your email for the code after filling out the form: https://forms.gle/3hhEv4Z9DDwVAKMJA",
    usage: "verify XXXXXX",
    example: "verify 123456",
    allowedChannels:["932883883211505694"],
    init:init,
    run:run,
}