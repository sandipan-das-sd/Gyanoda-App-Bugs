import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "rediss://default:AYZSAAIncDFiYTFiNGRkZGYxNmI0YThiODFkODU0NDk3OWRlYjY3YnAxMzQzODY@allowed-insect-34386.upstash.io:6379";

let redis:any;

try {
  redis = new Redis(REDIS_URL);
  console.log("Redis connected");
} catch (error) {
  console.error("Redis connection error:", error);
  throw new Error("Redis not connected");
}

export { redis };