const Redis = require("ioredis");

// Tạo kết nối Redis
const redis = new Redis({ 
    host: "redis-12744.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com", 
    port: 12744, 
    password: "qsR2GDlQQpU84ghtUDKKoW4B23ozoWtO" 
});

// Tạo Redis Subscriber để lắng nghe tin nhắn từ Redis
const subscriber = new Redis({ 
    host: "redis-12744.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com", 
    port: 12744,
    password: "qsR2GDlQQpU84ghtUDKKoW4B23ozoWtO"
});

console.log("✅ Redis đã kết nối");

module.exports = { redis, subscriber };
