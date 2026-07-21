const IORedis = require("ioredis");

const redisConnection = new IORedis(
    process.env.REDIS_URL,
    {
        maxRetriesPerRequest:null
    }
);


redisConnection.on("connect",()=>{
    console.log("Redis Connected");
});


redisConnection.on("error",(err)=>{
    console.log("Redis Error:",err.message);
});


module.exports = redisConnection;