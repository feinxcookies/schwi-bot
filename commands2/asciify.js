module.exports = {
    name: 'asciify',
    alias:['ascii', 'asciify'],
    description: "converts an image to greyscale ascii, the image should be attached or a url provided",
    usage: "ascii <width> <height> <image url or attachment>",
    example: "",
    init(){},
    run(message, args, client, inputCommand) {
    
        const Jimp = require('jimp');
        
        

        var gscale = ' ░▒▓';
       // var gscale = ' .x%@X';
       // var gscale = ' .,:+xX0$@';
        //var gscale = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^'. ";
        const garray = gscale.split("");

        var url = '';
        var w = 60;
        var h = 30;
        
        if (message.attachments.size == 1) {
            
            args.unshift(message.attachments.first().url);
            
        
        }
        //console.log(args);
        url = args[0];
        if (args.length == 3) {
            url = args[0];
            w = parseInt(args[1]);
            h= parseInt(args[2]);
        }
        var arr = [];
        
        Jimp.read(url).then( (img) => {
            
            img.resize(w,h).quality(60).greyscale();
            
            img.scan(0,0,w,h, (x,y, idx) => {
                arr[idx] = img.bitmap.data[idx];
            });
            var txt = [];
            arr.forEach( (x, i) => {
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
        });
        
    }
}