import Redis from 'ioredis';
import { serverEnv } from '../env';

const redis = new Redis(serverEnv!.REDIS_URL);

export default redis;