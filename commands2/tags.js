const {Collection} = require('discord.js');

module.exports = {
    name: 'tags',
    alias:['tags'],
    description: "WIP",
    usage: "tags add",
    example: "tags TEST 123 abc",
    run(message, args, client, inputCommand) {
        // tags all|list
        // tags self
        // displays list as <username> | <data>
        // tags addcategory <category>
        // adds a category [MOD only]
        // tags join <category> <data>
        // tags edit <category>

        // "please join "
        // tags remove
        // tags is a collection of 
        // data structure is collection that maps userid to a collection of different tags and each with their own fields
        const fs = require('fs');
        const fileName = 'data.txt';
        var database = readData();
        const tagsFile = 'tags.txt';
        var tagFilestr = '';
        var tags;
        try {
            tagFilestr= fs.readFileSync(tagsFile,{encoding:'utf8'});
            tags = JSON.parse(tagFilestr);
        } catch {
            tags = [];
        }
        // let d2 = new  Collection;
        // let bb = {data: 'xd', ping:'true'};

        // d2.set('tagA',bb);
        // database.set('uid',d2);
        switch(args[0]) {
            case undefined:
                client.commands.get(client.aliasMap[help]).run(message, ['tags'], client);
                
                
            break;
            case 'add':
                if (tags.includes(args[1])) {
                 var data = message.content.slice(message.content.search(args[1]) + args[1].length).trim();
                addData( message.author.id, args[1], data);
                writeData();
                message.channel.send(`added tag: \`${args[1]}\` with data: \`${data}\` for user: \`${message.author.username}\``);
                } else {message.channel.send("tag doesn't exist")}
            break;
            case 'remove': //remove your own tag
                database.get(message.author.id).delete(args[1]);
                writeData();
            break;
            case 'removeuser': //remove a users profile
            if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) return;
                database.delete(message.author.id);
                writeData();
            break;
            case 'profile':
                if (database == undefined || database.get(message.author.id) == undefined) {
                    message.channel.send(`no tags added for user, add a tag using ${client.config.prefix}tags add <tag> <data>`);
                }
                var m1 = '``` tags    | data           | ping \n';
                database.get(message.author.id).forEach((value, key) => {
                    m1 += key.padEnd(9) + ':' + value.data.padEnd(16) + ':' + value.ping.toString().padEnd(6) + '\n';
                })
                m1+= '```';
                message.channel.send(m1);
            break;
            case 'list':
                var m1 = '```\n';
                tags.forEach(tag => {
                    m1 += tag + '\n';
                })
                m1 += '```';
                message.channel.send(m1);
            break;
            case 'addTag':
            case 'addtag':
                if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) return;

               // message.channel.send('are you sure you want to add a new tag?');

                if (args[1] == undefined) {
                    message.channel.send('please specify a tag to add');
                }
                if (!tags.includes(args[1])) {
                    tags.push(args[1]);
                }
                saveTags();
            break;
            case 'removeTag':
            case 'removetag':
                if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) return;
                tags.splice(tags.indexOf(args[1]),1);
                saveTags();
            break;
            case 'removeAll':
            case 'removeall':
                if (!message.guild.member(message.author).permissions.has('MANAGE_CHANNELS')) { 
                    message.channel.send('error you need to be an admin to use this command');
                }
                tags = [];
                break;
                saveTags();
        }
        
        function saveTags (){
            var str = JSON.stringify(tags);
            fs.writeFileSync(tagsFile, str);
        }
        function addData (userid, tag, data, ping = true) {
            var tagsColl;
 
            if (database.get(userid) == undefined) {
                tagsColl = new Collection;
            }
            else {tagsColl = database.get(userid)};
            
            let obj = new Object;
            obj.data = data;
            obj.ping = ping;
            tagsColl.set(tag, obj);
            database.set(userid, tagsColl);
        }
        function writeData () {
           // console.log(database);
            // acts on database object 
          //  console.log('writing');
            let obj = {};
            database.forEach( (coll,uid) => {
                let obj2 = {};
                coll.forEach((value, key) => {
                    obj2[key] = value;
                })
                obj[uid] = obj2;
            })
                //console.log(JSON.stringify(obj));
               fs.writeFileSync(fileName, JSON.stringify(obj));
        }
        // file should be 
        //  //              <uid>:tag:1/data\s
        // need to search for :" and "\o
        // database should be 2d collection collection[uid][tag]
        function readData () {
            var newColl = new Collection;
            try {
            var file = fs.readFileSync(fileName, {encoding:'utf8'});
            } catch (err){throw err};
            data = JSON.parse(file);
            
            Object.keys(data).forEach(user => {
                var userColl = new Collection;
                let obj = data[user];
                Object.keys(obj).forEach(tag => {
                    userColl.set(tag, obj[tag]);
                });
                newColl.set(user, userColl);
            });
            
            return newColl;
        }
    }
}

