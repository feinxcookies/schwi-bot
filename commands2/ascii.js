module.exports = {
    name: 'ascii',
    alias:['ascii'],
    description: "WIP",
    usage: "ascii <width> <height> [-<option>:<value",
    example: "s.ascii 100 80 true .,:+xX0$@",
    run(message, args, client) {
        const https = require('https');
        const fs = require('fs');
        const { Image } = require('image-js');
        let fileInfo = null;
        var url = '';
        if (message.attachments.length == 0) {
           url = args[0];
        } else {
            url = message.attachments.first().url;
        }  
        var img = ''; // 8Mb image upload size limit
        const request = https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
                }
        
                fileInfo = {
                mime: response.headers['content-type'],
                size: parseInt(response.headers['content-length'], 10),
                };
                //console.log(fileInfo);
                var size = 0;
                response.setEncoding('binary');
                response.on('data', (chunk) => {
                img += chunk;
            })
                response.on('end', () => {
            //         fs.writeFile('img.png', img, 'base64', function (err) {
            //             if (err) return console.log(err);
            //         });
                gscaleOG = ' .\'^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
                        gscale2 = ' .\'^",:;Il!i><+-?][}{1)(\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao#MW&8%B@$';
                    gscale = ' .,:;~+?txmXC#%';
                        gscale_adj = ' .,:+xX0$@';
                        block = '▁▂▅▇';
                        block4 = ' ░▒▓';
                        gscale = block4;
                        if (args[3] != undefined) {
                        gscale = args[3];
                        }
                        if (args[4] == 'space') {
                        gscale = ' ' + gscale;
                        }
                        
                const garray = gscale.split("");
                //console.log(garray[Math.floor(128 / 256 * garray.length)]);
                img_buf = Buffer.from(img, 'binary');
                Image.load(img_buf).then(image => {
                    var grey = image.grey().getChannel(0);
                    // var edge = image.grey().cannyEdge().getChannel(0);
                    var w = parseInt(args[0]);
                    var h = parseInt(args[1]);
                    console.log(w, h);
                    var smol = grey.resize({width: w, height: h});
                    if (args[2] == "true") {
                        smol = smol.invert();
                    }
                    // var smol_edge = edge.resize({width: w, height: h});
                    //console.log(smol.data);
                    var txt = [];
                    
                    smol.data.forEach( (x, i) => {
                        //console.log(smol_edge.data[i]);
                        // if (smol_edge.data[i] == 255) {
                        //     txt.push('$');
                        // } else {
                            txt.push(garray[Math.floor(1.0 * x / 256 * garray.length)])
                        // }
                    
                    });
                    //console.log(txt);
                    var m = '```'; 
                    var size = 0;
                    for (var y = 0; y < h; y++) {
                        var line = '';
                        //console.log(typeof(size),w);
                        if (size + w >= 2000) {
                            m += '```'; 
                            message.channel.send(m);
                            m = '```'; 
                            size = 0.0;
                        }
                        for (var x = 0; x < w; x++) {
                            
                            line += txt[y*w + x];
                        }
                        size += w;
                        line += "\n";
                        m+= line;
                    }
                    m+= '```'; 
                    message.channel.send(m);

                    // fs.writeFile('smol.png', smol.toBase64('png'),'base64', function (err) {
                    //     if (err) return console.log(err);
                    // });

                });
            });
            




            
        })
        request.end();
    }
}