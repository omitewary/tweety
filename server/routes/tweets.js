const Twitter = require('twitter');
const config = require('config');
const SearchKey = require('../../models/searchKey.model');

module.exports = (app, io) => {
    let twitter = new Twitter({
        consumer_key: config.get('TWITTER_CONSUMER_KEY'),
        consumer_secret: config.get('TWITTER_CONSUMER_SECRET'),
        access_token_key: config.get('TWITTER_ACCESS_TOKEN_KEY'),
        access_token_secret: config.get('TWITTER_ACCESS_TOKEN_SECRET')
    });

    let socketConnection;
    let twitterStream;

    app.locals.searchTerm = ''; //Default search term for twitter stream.
    app.locals.showRetweets = false; //Default

    /**
     * Resumes twitter stream.
     */
    const stream = () => {
        if (app.locals.searchTerm) {
            console.log('Resuming for ' + app.locals.searchTerm);
            twitter.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
                stream.on('data', (tweet) => {
                    sendMessage(tweet);
                });

                stream.on('error', (error) => {
                    console.log(error);
                });

                twitterStream = stream;
            });
        }
    }

    /**
     * get first 25 tweets based on search item
     */
    /*app.post('/setSearchTerm', (req, res) => {
        //twitterStream.destroy();
        let term = req.body.searchTerm;
        app.locals.searchTerm = term;
        let params = {
            q: term,
            count: 25
        }
        twitter.get('search/tweets', params, (err, tweets, response) => {
            //console('logdata : ', tweet);
            if (err) {
                res.status(500);
            } else {
                //res.status(200);
                res.json(tweets);
                if (twitterStream) {
                    twitterStream.destroy();
                }
                stream();
            }
        });
    })*/

    /**
     * Sets search term for twitter stream.
     */
    app.post('/setSearchTerm', async (req, res) => {
        let term = req.body.searchTerm;
        app.locals.searchTerm = term;
        if (twitterStream) twitterStream.destroy();
        try {
            /**
             * @desc store searched word with date in DB 
             */
            let payload = {searchedTerm: term}
            const searched = await SearchKey.update(payload, payload, {upsert: true, setDefaultsOnInsert: true})
            //const searched = await SearchKey.create({searchedTerm: term})
            res.json(searched);
            await stream();
        } catch(err) {
            console.log(err)
            res.status(500).send('Server Error');
        }
    });

    /**
     * set tweet count
     */
    app.post('/setCount', async (req, res) => {
        let term = req.body.payload.searchTerm;
        let payload = req.body.payload
        try {
            const result = await SearchKey.updateOne({searchedTerm: term}, payload, {upsert: true, setDefaultsOnInsert: true});
            const maxTweeted = await SearchKey.findOne().sort('-notificationCounter');
            res.json(maxTweeted);
        } catch (err) {
            console.log('err :', err)
        }

    })

    /**
     * Pauses the twitter stream.
     */
    app.post('/pause', (req, res) => {
        console.log('Pause');
        twitterStream.destroy();
    });

    /**
     * Resumes the twitter stream.
     */
    app.post('/resume', (req, res) => {
        console.log('Resume');
        stream();
    });

    //Establishes socket connection.
    io.on("connection", socket => {
        socketConnection = socket;
        stream();
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
    });

    /**
     * Emits data from stream.
     * @param {String} msg 
     */
    const sendMessage = (msg) => {
        if (msg.text.includes('RT')) {
            return;
        }
        socketConnection.emit("tweets", msg);
    }
};