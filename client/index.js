const Client = require('./Cody');
const Cody = new Client({
    token: process.env.TOKEN,
    owner: '337410863545843714',
    prefix: 'cc!'
})