const {Collection} = require('discord.js');

module.exports = {
    name: 'tags',
    alias:['tags'],
    description: "WIP",
    usage: "tags add",
    example: "tags",
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
        let database = readData();
        
        
        switch(args[0]) {
            case '':
                client.commands.get(client.aliasMap[help]).run(message, ['tags'], client);
            break;
            case 'add':
                 var data = message.content.slice(message.content.search(args[1]) + args[1].length).trim();
                addTag( message.author.id, args[1], data);
                
            break;
            case 'remove':
                database.delete()
            break;
            case '':
            break;
            case '':
            break;
        }
        
        // data line format: 
        const listPlatforms = () => {

        }
        const listUserTags = (user) => {
            
        }

           
            
        
        function addTag (userid, tag, data, ping) {
            if (database[userid] == undefined) {
                database[userid] = new Collection;
            }
            database[userid].set(tag, data);
            console.log(database);
            writeData();
        }
        function writeData () {
            // acts on database object 
            var data = '';
            database.forEach( (coll,uid) => {
                data += uid + ':';
                coll.forEach((value, key) => {
                    data+= key + ':' + data + '\o';
                })
                data += '\n';
            })
            console.log(data);
                fs.writeFileSync(data);
            
        }
        // file should be 
        //                <uid>:tag:1/data\s
        // need to search for :" and "\o
        // database should be 2d collection collection[uid][tag]
        function readData () {
            var newColl = new Collection;
            try {
            var data = fs.readFileSync(fileName, {encoding:'utf8'});
            } catch {return newColl};
            
            data = data.split('\n');
            var uid = '';
            data.forEach(line => {
                uid = line.slice(0,line.search(':'));
                var tags = line.slice(line.search(':') + 1, -1).split('\o');
                var tagColl = new Collection;
                tags.forEach(tag => {
                    var splt = tag.split(':');
                    tagColl.set(splt[0], splt[1]);
                });
                newColl.set(uid, tagColl);
            });
            return newColl;
        }
    }
}

