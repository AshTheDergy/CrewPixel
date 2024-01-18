require('dotenv').config({ path: './settings/.env' });
module.exports = {
    TOKEN: process.env.TOKEN,
    whiteList: [], //roles
}