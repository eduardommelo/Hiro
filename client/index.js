const Client = require('./Cody');
const Cody = new Client({
    token: process.env.TOKEN,
    prefix: 'cc!'
})