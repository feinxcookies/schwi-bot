module.exports = {
    name: 'emojify_pixels',
    alias:['e','emojify'],
    description: "",
    usage: "emojify <width> <height> <attachment or url>",
    example: "emojify 30 30 `example.jpg`",
    init(){},
    run(message, args, client, inputCommand) {
  
        const Jimp = require('jimp');
        //  var gscale = ' ░▒▓';
        // var gscale = ' .x%@X';
        // var gscale = ' .,:+xX0$@';
        //var gscale = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^'. ";
        //const garray = gscale.split("");

        var url = '';
        var w = 40;
        var h = 40;
        
        if (message.attachments.size == 1) {
            url = message.attachments.first().url;
            console.log(url);
            if (args.length == 2) {
                w = parseInt(args[0]);
                h = parseInt(args[1]);
            }
        } else if (args.length == 3) {
            url = args[2];
            w = parseInt(args[0]);
            h = parseInt(args[1]);
        } else {
            url = args[0];
        }
        var txt = new Array(w*h);
        Jimp.read(url).then( (img) => {
            
            img.resize(w,h, Jimp.RESIZE_HERMITE);
            img.scan(0,0,w,h, function (x,y, idx) {
                var red = this.bitmap.data[idx + 0]/256;
                var green = this.bitmap.data[idx + 1]/256;
                var blue = this.bitmap.data[idx + 2]/256;
                var max = Math.max(red,green,blue);
                var min = Math.min(red,green,blue);
                var chroma = max - min;
                var hue = 0;
                var lightness = (max + min)/2;
                var char = '';
                var sat = chroma / (1 - Math.abs(2*lightness - 1));
                if (chroma == 0) {
                    char = '';
                    sat = 0;
                }
                else if (max == red) hue = ((green-blue)/chroma) % 6;
                else if (max == green) hue = (blue - red)/chroma + 2;
                else if (max == blue) hue = (red - green)/chroma + 4;
                if (idx == 0) console.log(sat);
                hue = hue*60;
                if ( hue >= 330 || hue < 30) char = '🟥';
                else if (hue >=30 && hue < 90) char =  '🟨';
                else if (hue >= 90 && hue < 150) char = '🟩';
                else if (hue >= 150 && hue < 210) char = '🧊';
                else if (hue >= 210 && hue < 270) char = '🟦';
                else if (hue >= 270 && hue < 330) char = '🟪';
                if (sat < 0.3) {
                    if (lightness > 0.5) {
                        char = '⬜';
                    } else {
                        char = '⬛';
                    }
                }
                txt[x + w*y] = char;
            });
            
        
        

            // output to discord
            var m = '```'; 
            var size = 3;
            for (var y = 0; y < h; y++) {
                var line = '';
                if (size + w + 3>= 2000) {
                    m += '```'; 
                    message.channel.send(m);
                    m = '```'; 
                    size = 3;
                }
                for (var x = 0; x < w; x++) {
                    line += txt[y*w + x];
                }
                size += w + 1;
                line += "\n";
                m+= line;
            }
            m+= '```';
            
            message.channel.send(m);
        
        });
    }
}