if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to database!')
}).catch(() => {
    console.log('Connection to database failed!')
})

module.exports = { mongoose }