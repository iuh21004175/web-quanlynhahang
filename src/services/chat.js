const { redis, subscriber } = require("../config/redis");

const chatService = (io) => {
    io.on("connection", (socket) => {
        
    });
};

module.exports = chatService;
