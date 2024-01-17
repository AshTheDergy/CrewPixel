require('dotenv').config();
module.exports = {
    TOKEN: process.env.TOKEN,
    whiteList: ["1192487839368220742", "1135261452605865995"],
    strings: {
        startError: 'A game of Among Us has not been started yet.\nSend a game room code to start one!',
        userPermError: 'You need to be a Game Master or Event staff to run this command',
        reactionError: 'meow',
    },
}