var read = require('read-file');


(async function main() {

    var pathToFile = './texts/' + process.argv[2];
    var words = [];
    var counts = [];
    var bigrams = [];
    var biCounts = [];
    read(pathToFile, {
        encoding: 'utf8'
    }, async function (err, buffer) {
        var parsed = buffer.split(' ');
        await parsed.forEach(e => {
            lower = e.toLowerCase();
            let index = words.indexOf(lower);
            for (let i = 0; i < e.length - 1; i++) {
                let bigram = lower[i] + lower[i+1];
                if (bigrams.indexOf(bigram) <= -1) {
                    bigrams.push(bigram);
                    biCounts.push(1);
                } else {
                    biCounts[bigrams.indexOf(bigram)]++;
                }
            }

            if(e.length > 2 && index <= -1) {
                words.push(e.toLowerCase());
                counts.push(1);
            } else {
                counts[index]++;
            }
        });
        for (let i = 0; i < words.length; i++) {
            console.log( `"${words[i]}", ${counts[i]}`);
        }
        for (let i = 0; i < bigrams.length; i++) {
            console.log( `"${bigrams[i]}"\t "${biCounts[i]}"`);
        }
    });
})();