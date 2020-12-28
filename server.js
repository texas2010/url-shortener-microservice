if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('dns');

const { mongoose } = require('./db/mongoose');
const { Url } = require('./models/url');
const { randomStringGenerator } = require('./utils/random-string-generator');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', (req, res) => {

    // need to check not empty String
    if (req.body.url !== '') {
        try {
            // check valid url
            const realUrl = new URL(req.body.url)
            console.log(realUrl.protocol);
            if (!['https:', 'http:'].includes(realUrl.protocol)) {
                return res.json({ error: 'invalid url' })
            }
            dns.lookup(realUrl.hostname, (error, address, family) => {
                if (error) return res.json({ error: 'invalid url' })
                //create short url
                const randomShortUrl = randomStringGenerator(5)

                //check if short url is exist or not
                const original_url = req.body.url
                const short_url = randomShortUrl
                const urlData = new Url({
                    original_url,
                    short_url
                })

                urlData.save().then((doc) => {
                    res.json({
                        original_url,
                        short_url
                    })
                }).catch((error) => {
                    if (error.keyValue.original_url) {
                        Url.findOne({ original_url: error.keyValue.original_url }).then((doc) => {
                            if (!doc) {
                                res.json({ error: 'invalid url' })
                            }
                            res.json({
                                original_url: doc.original_url,
                                short_url: doc.short_url
                            })
                        }).catch((error) => {
                            res.json({ error: 'invalid url' })
                        })
                    } else {
                        res.json({ error: 'invalid url' })
                    }
                })
            })
        } catch (error) {
            res.json({ error: 'invalid url' })
        }

    } else {
        res.json({ error: 'invalid url' })
    }

})

app.get('/api/shorturl/:shortUrl', (req, res) => {
    console.log(req.params.shortUrl);
    const shortUrl = req.params.shortUrl
    Url.findOne({ short_url: shortUrl }).then((doc) => {
        if (!doc) {
            return res.json({ error: 'invalid url' })
        }
        res.redirect(doc.original_url)
    }).catch((error) => {
        res.json({ error: 'invalid url' })
    })
})

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
