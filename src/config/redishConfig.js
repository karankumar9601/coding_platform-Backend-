const redis = require("redis")

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-10325.c91.us-east-1-3.ec2.cloud.redislabs.com',
        port: 10325
    }
})

module.exports= redisClient;