// twitter-node does not modify GLOBAL, that's so rude
var TwitterNode = require('twitter-node').TwitterNode
  , sys         = require('sys')
  , cradle      = require('cradle')

var db = new(cradle.Connection)('http://127.0.0.1', 5984, {
    auth: { username: '', password: '' }
}).database('eshmana');

var tweet_regex = /(.+)\s*[:|=](.+)/g;
//TODO: Definately need a better way here
//BTW: These are the words I know, need some help find more!!
var tweet_profanity = /^[ال]*(كس|زب|مكوة|قراقر|قظ|خنيث|منيوج|نيج|سكس|نيك|قواد|طيز)|\s+[ال]*(كس|زب|مكوة|قراقر|قظ|خنيث|سكس|منيوج|نيج|نيك|قواد|طيز)\s+|[ال]*(كس|زب|مكوة|قراقر|قظ|خنيث|سكس|منيوج|نيج|نيك|قواد|طيز)$/gi;
var tweet_strip = /\s*\w*\@|”|“|&quot;|#\w*\s*/g;

// you can pass args to create() or set them on the TwitterNode instance
var twit = new TwitterNode({
  user: 'HaveAProblem', 
  password: 'warzone',
  track: ['QatarWord']
});

// Make sure you listen for errors, otherwise
// they are thrown
twit.addListener('error', function(error) {});

twit
  .addListener('tweet', function(tweet) {
        function sleep(milliSeconds) {
            var startTime = new Date().getTime();
            while (new Date().getTime() < startTime + milliSeconds);
        }
        //sleep(1000);
        var tweetText = tweet.text;
        if ( profanity = tweet_profanity.exec(tweetText) )
            return;
        if ( match = tweet_regex.exec(tweetText) ) {
            var word = match[1].trim();
            var meaning = match[2].replace(tweet_strip, '').trim();
            var letter = word.charAt(0).trim();
            //Debug
            //sys.puts('Added new tweet');
            //sys.puts('word = ' + word);
            //sys.puts('meaning = ' + meaning);
            //sys.puts('letter = ' + letter);
            db.save({
                'live': true,
                'edited': false,
                'letter': letter,
                'word': word,
                'meaning': meaning,
                'type': 'definition',
                'tweet-data': tweet
            }, function (err, res) {
                //siliently fail
            });
        }
  })
  .stream();