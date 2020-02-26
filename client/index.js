require('dotenv').config();
const Client = require('./Cody');
const Cody = new Client({
    token: process.env.TOKEN,
    owners: [
        '332349931715166218', 
        '337410863545843714'
    ],
    prefix: 'cc!'
})