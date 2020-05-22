const Client = require('./Hiro');
const Hiro = new Client({
    token: process.env.TOKEN,
    owner: '337410863545843714',
    prefix: process.env.PREFIX
})