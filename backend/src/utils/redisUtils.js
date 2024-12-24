const redisClient = require('../config/redisClient');

// Delete Keys Matching a Pattern
redisClient.delPattern = async (pattern) => {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};
