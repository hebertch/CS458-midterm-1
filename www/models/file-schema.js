var mongoose = require('mongoose');
var fileSchema = mongoose.Schema({
        name: String,
        wordCount: Number,
        words: [{
            word: String,
            count: Number
        }],
        bigrams: [{
            bigram: String,
            count: Number
        }],
        ngrams: [{
            ngram: String,
            count: Number
        }]  
});
// create the model for users and expose it to our app
module.exports = mongoose.model('dbFile', fileSchema);
