const Client = require('./Cody');
const Cody = new Client({
    token: process.env.TOKEN,
    owners: [
        '332349931715166218', 
        '337410863545843714', 
        '379727083284463626'
    ],
    prefix: 'cc!'
})