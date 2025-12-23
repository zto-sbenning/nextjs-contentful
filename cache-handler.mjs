import fs from 'fs';
import path from 'path';

/**
 * Get the build ID from the .next folder.
 */
export function getBuildId() {
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    return fs.readFileSync(buildIdPath, 'utf8').trim();
}

import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

import { CacheHandler } from "@fortedigital/nextjs-cache-handler";
import createRedisHandler from "@fortedigital/nextjs-cache-handler/redis-strings";
import createLruHandler from "@fortedigital/nextjs-cache-handler/local-lru";
import createCompositeHandler from "@fortedigital/nextjs-cache-handler/composite";
import { createClient } from "redis";

/**
 * This file initializes the cache handler for Next.js 15+.
 * It uses Redis as the primary cache and LRU as a fallback.
 * The cache is configured to use a composite handler that switches between Redis and LRU based on tags.
 */
// Usual onCreation from @neshca/cache-handler
CacheHandler.onCreation(() => {
    // Important - It's recommended to use global scope to ensure only one Redis connection is made
    // This ensures only one instance get created
    if (global.cacheHandlerConfig) {
        return global.cacheHandlerConfig;
    }

    // Important - It's recommended to use global scope to ensure only one Redis connection is made
    // This ensures new instances are not created in a race condition
    if (global.cacheHandlerConfigPromise) {
        return global.cacheHandlerConfigPromise;
    }

    // You may need to ignore Redis locally, remove this block otherwise
    if (process.env.NODE_ENV === "development") {
        const lruCache = createLruHandler({
            maxItemSizeBytes: 1024 * 1024 * 1024, // 1 GB
        });
        return { handlers: [lruCache] };
    }

    // Main promise initializing the handler
    global.cacheHandlerConfigPromise = (async () => {
        /** @type {import("redis").RedisClientType | null} */
        let redisClient = null;
        if (PHASE_PRODUCTION_BUILD !== process.env.NEXT_PHASE) {
            const settings = {
                url: process.env.REDIS_URL, // Make sure you configure this variable
                pingInterval: 10000,
            };

            // This is optional and needed only if you use access keys
            if (process.env.REDIS_ACCESS_KEY) {
                settings.password = process.env.REDIS_ACCESS_KEY;
            }

            try {
                redisClient = createClient(settings);
                redisClient.on("error", (e) => {
                    if (typeof process.env.NEXT_PRIVATE_DEBUG_CACHE !== "undefined") {
                        console.warn("Redis error", e);
                    }
                    global.cacheHandlerConfig = null;
                    global.cacheHandlerConfigPromise = null;
                });
            } catch (error) {
                console.warn("Failed to create Redis client:", error);
            }
        }

        if (redisClient) {
            try {
                console.info("Connecting Redis client...");
                await redisClient.connect();
                console.info("Redis client connected.");
            } catch (error) {
                console.warn("Failed to connect Redis client:", error);
                await redisClient
                    .disconnect()
                    .catch(() =>
                        console.warn(
                            "Failed to quit the Redis client after failing to connect."
                        )
                    );
            }
        }
        const lruCache = createLruHandler({
            maxItemSizeBytes: 1024 * 1024 * 1024, // 1 GB
        });

        if (!redisClient?.isReady) {
            console.error("Failed to initialize caching layer.");
            global.cacheHandlerConfigPromise = null;
            global.cacheHandlerConfig = { handlers: [lruCache] };
            return global.cacheHandlerConfig;
        }

        const buildId = getBuildId();
        if (!buildId) {
            console.error("Failed to get build ID for cache handler.");
            global.cacheHandlerConfigPromise = null;
            global.cacheHandlerConfig = { handlers: [lruCache] };
            return global.cacheHandlerConfig;
        }

        const keyPrefix = `nextjs:${buildId}:`;
        console.info(`Using key prefix: ${keyPrefix}`);

        const redisCacheHandler = createRedisHandler({
            client: redisClient,
            keyPrefix: keyPrefix,
        });

        global.cacheHandlerConfigPromise = null;

        // This example uses composite handler to switch from Redis to LRU cache if tags contains `memory-cache` tag.
        // You can skip composite and use Redis or LRU only.
        global.cacheHandlerConfig = {
            handlers: [
                createCompositeHandler({
                    handlers: [lruCache, redisCacheHandler],
                    setStrategy: (ctx) => (ctx?.tags.includes("memory-cache") ? 0 : 1), // You can adjust strategy for deciding which cache should the composite use
                }),
            ],
        };

        return global.cacheHandlerConfig;
    })();

    return global.cacheHandlerConfigPromise;
});

export default CacheHandler;
