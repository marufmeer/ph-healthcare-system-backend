import { createClient } from 'redis';
import { envVars } from '.';

export const redisclient = createClient({
  username: envVars.REDIS.USERNAME,
  password: envVars.REDIS.PASSWORD,
  socket: {
    host: envVars.REDIS.HOST,
    port: envVars.REDIS.PORT,
    reconnectStrategy: retries => {
      console.warn(`Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000); // retry after 100ms, max 3s
    },
  },
});

redisclient.on('error', err => console.error('❌ Redis Client Error:', err));
redisclient.on('connect', () => console.log('✅ Redis client connecting...'));
redisclient.on('ready', () => console.log('✅ Redis client ready'));

/**
 * Connects to Redis
 */
export const redisConnect = async () => {
  try {
    await redisclient.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error; // re-throw so app can handle startup failure
  }
};

export default redisConnect;
