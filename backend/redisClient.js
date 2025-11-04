import { createClient } from 'redis';

const redisClient = createClient({
    // Default redis server://127.0.0.1:6379
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await redisClient.connect();
    console.log('Connected to Redis successfully!');
    
    // 1. Đặt giới hạn bộ nhớ tối đa (ví dụ: 100MB). Chính sách xóa chỉ hoạt động khi có giới hạn.
    await redisClient.configSet('maxmemory', '100mb');
    // 2. Đặt chính sách xóa là 'allkeys-lru': Xóa các key ít được sử dụng gần đây nhất khi bộ nhớ đầy.
    await redisClient.configSet('maxmemory-policy', 'allkeys-lru');
    console.log('Redis memory policy configured to allkeys-lru with a 100mb limit.');
})();

export default redisClient;
