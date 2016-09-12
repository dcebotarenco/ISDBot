var readline = require('readline');
var fs = require('fs');
var lines = [];
class ReadData
{
    constructor() {}
    static read(path)
    {
        var rl = readline.createInterface({
            input: fs.createReadStream(path)
        });

        rl.on('line', (line) => {
            lines.push(line);
        });
        return lines;
    }

}
module.exports = ReadData;