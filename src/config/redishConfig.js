const redis = require("redis")

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13971.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 13971
    }
})

module.exports= redisClient;