const {Collection, Invite} = require('discord.js');
const {GoogleSpreadsheet} = require('google-spreadsheet');
const { grayscale } = require('jimp');
require('dotenv').config();
"use strict";
class TagManager {
    sheet;
    userCount;
    tagCount;
    tagCells;
    tagNames;
    userCells;
    async init (googleSheet) {
        this.sheet = googleSheet;
        await this.sheet.loadCells({startRowIndex: 0, endRowIndex: googleSheet.rowCount, startColumnIndex:0, endColumnIndex: googleSheet.columnCount});
        this.userCount = this.sheet.getCell(0,0).value;
        this.tagCount = this.sheet.getCell(0,2).value;
        this.tagCells = Array.from({ length: this.tagCount}, (_,j)=>this.sheet.getCell(1,2 + j)).sort((a,b) => a.value.localeCompare(b.value));
        this.tagNames = Array.from(this.tagCells, (tagCell) => {return tagCell.value});
        this.userCells = Array.from({ length: this.userCount}, (_,i)=>{
            var userCell = {};
            userCell.name = this.sheet.getCell(2 + i,0);
            userCell.id = this.sheet.getCell(2 + i, 1);
            userCell.tags = Array.from(this.tagCells, (tagCell,j) => this.sheet.getCell(2 + i,tagCell.columnIndex));
           // console.log(userCell.tags);
           // userCell.tags = Array.from({ length: this.tagCount}, (_,j)=>this.sheet.getCell(2 + i, 2 + j)).sort((a,b)=> this.sheet.getCell(1, a.columnIndex).value - this.sheet.getCell(1, b.columnIndex).value);
            return userCell;
        }).sort((a,b)=> a.name.value.localeCompare(b.name.value));

        console.log("initialized tagMgr");
    }
    async save_data () {
        this.sheet.getCell(0,0).value = this.userCount;
        this.sheet.getCell(0,2).value = this.tagCount;
        await this.sheet.saveUpdatedCells();
        this.init(this.sheet);
    }
    //async add_tag(message.author.id, args[1], data)
    async add_tag_user(user, tagName, data) {
        var target = this.userCells.find((userCell)=>userCell.id.value == user.id);
        if (target == undefined) {
            target = this.add_user(user);
        }
        // assume tag exists
        const index = this.tagNames.findIndex((str)=> str == tagName);
        target.tags[index].value = JSON.stringify([data, false]);
        this.save_data();
    }
    add_user(user) {
        var userCell = {};
        userCell.name = this.sheet.getCell(2 + this.userCount,0);
        userCell.name.value = user.username;
        userCell.id = this.sheet.getCell(2 + this.userCount, 1);
        userCell.id.value = user.id;
        userCell.tags = Array.from({ length: this.tagCount}, (_,j)=>this.sheet.getCell(2 + this.userCount, 2 + j));
        this.userCount++;
        return userCell;
    }
    remove_tag_user(user, tagName) {
        var target = this.userCells.find((userCell)=>userCell.id.value == user.id);
        const index = this.tagNames.findIndex((str)=> str == tagName);
        target.tags[index].value = null;
        this.save_data();
    }
    list_tags_user(user) {
        var target = this.userCells.find((userCell)=>userCell.id.value == user.id);
        if (target == undefined) return;
        const arr = Array.from({ length: this.tagCount}, (_,j)=> {
            const tag = target.tags[j];
            if (tag.value== null) return null;
            const val = JSON.parse(tag.value);
           //console.log({name: this.tagNames[j], data: val[0], ping: val[1]});
            return {name: this.tagNames[j], data: val[0], ping: val[1]};
        }).filter((e)=> e != null);
        return arr;
    }
    list_users_tag (tagName) {
        var tagIndex = this.tagCells.findIndex((tagCell)=>tagCell.value == tagName);
        if (tagIndex == undefined) return undefined;
        var arr = [];
        this.userCells.forEach((user,i)=> {
            const tag = user.tags[tagIndex];
            if (tag.value != null) {
                const val = JSON.parse(tag.value);
                arr.push({name: user.name.value, data: val[0], ping: val[1], id: user.id.value});
            }
        });
        return arr;
    }

    add_tag (tagName) {
        var tagCell = this.sheet.getCell(1, 2 + this.tagCount);
        tagCell.value = tagName;
        this.tagCount++;
        this.save_data();
        return tagCell;
    }
    rm_tag (tagName) {
        var tagIndex = this.tagCells.findIndex((tagCell)=>tagCell.value == tagName);
        if (tagIndex == undefined) return undefined;
        this.userCells.forEach((user,i)=> {
            const tag = user.tags[tagIndex];
            tag.value = null;
        });
        this.tagCells[tagIndex].value = null;
        this.tagCount = this.tagCount - 1;
        this.save_data();
    }
    cell_2_tag (cell) {
        var val = JSON.parse(cell.value);
        return {
            data: val[0],
            ping: val[1],
        }
    }
}
var doc;
var tagMgr = new TagManager;
module.exports = {
    name: 'tags',
    alias:['tags'],
    description: "stores data about different categories. Useful for storing usernames",
    usage: ["tags profile <user>               | lists categories that you have data stored to",
            "tags add <category> <tag> <ping>  | adds data for a given category to your profile, you can use this to edit what's already stored",
            "tags remove <category>            | removes a category from your profile",
            "tags list                         | lists categories that are available to add",
            "tags addCategory <Category>       | adds a category for users to use",
            "tags ping <category>              | mentions users in a category that have mentions on",
            "tags search <tag>                 | not implemented yet",
            "tags removeCategory <Category>    | removes a category (Mod only)",
            "tags remove <userID> <Category>   | removes a users tag (Mod only)",
            ],
    example: "",
    async init () {
        doc = new GoogleSpreadsheet('1l_BQXIBLxaZ9-xkKOJ0-EsoY25ESN0gYx5pHICeK7CY');
        await doc.useServiceAccountAuth({client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, private_key: process.env.GOOGLE_PRIVATE_KEY});
        await doc.loadInfo();
        console.log("opened sheet: " + doc.title);
        const sheet = doc.sheetsByIndex[0];
        await tagMgr.init(sheet);
    },
    async run (message, args, client, inputCommand) {
        //await doc.useServiceAccountAuth({client_email: auth.client_email, private_key: auth.private_key});
        // console.log(sheet.title);
        // console.log(sheet.rowCount);
        // console.log(sheet.headerValues);
        /////////// commands
        switch(args[0]) {
            case 'add':
                var category = args[1];
                data = args[2];
                ping = args[3];
                if (ping == undefined) {
                    ping = "false";
                }
                if (data == undefined) {
                    data = "empty";
                }
                if (!(ping == "true" || ping == "false")) {
                    message.channel.send("the ping field can only be true or false");
                    break;
                }

                if (tagMgr.tagNames.includes(category)) {
                    if (data == "" || data == []) {data = "empty"};
                    tagMgr.add_tag_user(message.author, category, data);
                message.channel.send(`added tag: \`${category}\` with data: \`${data}\` and ping?: \`${ping}\` for user: \`${message.author.username}\``);
                } else {message.channel.send("Category doesn't exist")}
            break;
            case 'remove': //remove your own tag or someone elses
                if (args[2] != undefined) {
                    if (message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) {
                        if (!tagMgr.tagNames.includes(args[1])) {
                            message.channel.send("tag doesn't exist");
                            break;
                        }
                        tagMgr.remove_tag_user(message.guild.members.fetch(args[2]), args[1]);
                    } else {message.channel.send("you need to be an admin to use this command"); break;}
                }
                tagMgr.remove_tag_user(message.author,args[1]);
            break;
            case 'removeuser': //remove a users profile
            if (message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')){

            }
            break;
            case 'list':
                var m1 = '```ini\n';
                if (args[1] == undefined) {
                    m1 += "Available tags: \n";
                    tagMgr.tagNames.forEach((tagStr) => {
                        m1 += tagStr + "\n";
                    })
                } else {
                    var category = args[1];
                    if (!tagMgr.tagNames.includes(category)) {
                        message.channel.send("Category doesn't exist");
                        break;
                    }
                    const arr = tagMgr.list_users_tag(category);
                    const wName = 15, wData = 10, wPing = 6;
                    m1+= "Listing users for tag: [" + category + "]\n"
                    m1+= "[Name]".padEnd(wName) + " " + "[Data]".padEnd(wData)+"[Ping?]"+"\n";
                    m1+= "\n".padStart(wName + 1 + wData + wPing, '-');
                    arr.forEach((e)=> {
                        m1 += e.name.padEnd(wName) + " " + e.data.padEnd(wData) + e.ping + '\n';
                    })
                }
                m1 += '```';
                message.channel.send(m1);
            break;
            case 'profile':
                var user = message.author;
                if (args[1] != undefined) {
                    const firstm = message.mentions.users.first();
                    if (firstm != undefined) {
                        user = firstm;
                    } else {
                    user = await message.guild.members.fetch(args[1]);
                    }
                }
                var target = tagMgr.userCells.find((userCell)=>userCell.id.value == user.id);
                if (target == undefined) {
                    message.channel.send("You don't have any tags added, please add a tag first using " + client.config.prefix + "tags add <category> <data> <[true|false]>");
                    break;
                }
                var tags = tagMgr.list_tags_user(user);
                var m1 = '```ini\n';
                const wName = 15, wData = 10, wPing = 6;
                m1+= "[Tag Name]".padEnd(wName) + " " + "[Data]".padEnd(wData)+"[Ping?]"+"\n";
                m1+= "\n".padStart(wName + 1 + wData + wPing, '-');
                tags.forEach((set) => {
                    m1 += set.name.padEnd(wName) + " " + set.data.padEnd(wData) + set.ping + '\n';
                })
                m1 += '```';
                message.channel.send(m1);
            break;
            case 'addCategory':
            case 'addCat':

               // message.channel.send('are you sure you want to add a new tag?');
                if (args[1] == undefined) {
                    message.channel.send('please specify a tag to add');
                    break;
                }
                var category = args[1];
                if (args[2] != undefined) {
                    message.channel.send("A category can only consist of a single word, you can use '_ to denote spaces'");
                    break;
                }
                if (!tagMgr.tagNames.includes(category)) {
                    tagMgr.add_tag(category);
                    message.channel.send("added tag: `" + category + "`!");
                } else {
                    message.channel.send('tag already exists!');
                }
            break;
            case 'remCat':
            case 'removeCat':
            case 'removeCategory':
                if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) {
                    message.channel.send("you need to be an admin to use this command");
                } else if (args[1] != undefined) {
                    if (!tagMgr.tagNames.includes(category)) {
                        message.channel.send("Category doesn't exist");
                        break;
                    }
                    tagMgr.rm_tag(args[1]);
                    message.channel.send("removed category: `" + args[1] + "`");
                } else {
                    message.channel.send("please specify a category to remove");
                }

            break;
            case 'ping':
                if (args[1] == undefined) {
                    message.channel.send("please specify a category to ping");
                    break;
                }
                if (!tagMgr.tagNames.includes(category)) {
                    message.channel.send("Category doesn't exist");
                    break;
                }
                const arr = tagMgr.list_users_tag(args[1]);
                const m = "mentioning Category: `" + args[1] + "`";
                arr.forEach((e)=> {
                    if (e.ping == "true") {
                        m += "<@" + e.id + "> ";
                    }
                });
                message.channel.send(m);
            break;
            default:
                client.commands.get(client.aliasMap['help']).run(message, ['tags'], client);
            break;    
        }
    }
}

