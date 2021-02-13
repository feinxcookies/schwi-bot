module.exports = {
    name: 'asciify',
    alias:['ascii', 'asciify'],
    description: "converts an image to greyscale ascii, the image should be attached",
    usage: "ascii <image url or attchment> <options> (JSON format)\n options: w,h,invert,scale",
    example: "s.ascii ",
    run(message, args, client, inputCommand) {
        const https = require('https');
        const fs = require('fs');
        const gm = require('gm');
        
        

        var gscale = ' ░▒▓';
        const garray = gscale.split("");

        var url = '';
        var w = 60;
        var h = 30;
        
        if (message.attachments.length == 1) {
            args.unshift(message.attachments.first().url);

        }
        if (args.length == 3) {
            w = args[1];
            h= args[2];
        }
        url = args[0];
        // change library OR rewrite url parsing regex
      smol = gm(url).resize().colorspace('GRAY')
            smol.data.forEach( (x, i) => {
                txt.push(garray[Math.floor(1.0 * x / 256 * garray.length)])
            });
            var m = '```'; 
            var size = 0;
            for (var y = 0; y < h; y++) {
                var line = '';
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
        
        
    }
}