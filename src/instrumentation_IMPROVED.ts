export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Skip warmup during CI/CD build phase
        if (process.env.CICD_PHASE === undefined) {
            const { createClient } = await import('redis');
            let redisClient = null;
            
            try {
                // Create Redis client with same config as cache handler
                const settings: any = {
                    url: process.env.REDIS_URL,
                };
                
                if (process.env.REDIS_ACCESS_KEY) {
                    settings.password = process.env.REDIS_ACCESS_KEY;
                }
                
                redisClient = createClient(settings);
                await redisClient.connect();
                
                // Get buildId to use same key prefix as cache handler
                const { getBuildId } = await import('../cache-handler.mjs');
                const buildId = getBuildId();
                
                if (!buildId) {
                    console.warn('⚠️  Failed to get buildId, skipping cache warmup');
                    return;
                }
                
                const warmupCompleteKey = `nextjs:${buildId}:warmed-up`;
                const warmupLockKey = `nextjs:${buildId}:warming-up`;
                
                // Check if warmup was already completed
                const isWarmedUp = await redisClient.exists(warmupCompleteKey);
                if (isWarmedUp) {
                    console.info('⏭️  Cache already warmed up, skipping...');
                    return;
                }
                
                // Try to acquire the warmup lock (5 minutes TTL in case of crash)
                const lockAcquired = await redisClient.set(warmupLockKey, '1', {
                    NX: true,  // Set only if key doesn't exist (atomic operation)
                    EX: 300    // Expire after 5 minutes
                });
                
                if (lockAcquired === 'OK') {
                    try {
                        console.info('🔥 Starting cache warmup (this process won the race)...');
                        const { registerInitialCache } = await import('@fortedigital/nextjs-cache-handler/instrumentation');
                        const CacheHandler = (await import('../cache-handler.mjs')).default;
                        await registerInitialCache(CacheHandler);
                        
                        // Mark warmup as completed (permanent flag, no expiration)
                        await redisClient.set(warmupCompleteKey, '1');
                        console.info('✅ Cache warmup completed successfully');
                    } catch (warmupError) {
                        console.error('❌ Cache warmup failed:', warmupError);
                        throw warmupError;
                    } finally {
                        // Always release the lock
                        await redisClient.del(warmupLockKey);
                    }
                } else {
                    console.info('⏳ Another process is already warming up the cache, waiting...');
                }
            } catch (error) {
                console.warn('⚠️  Failed to check/perform cache warmup:', error);
            } finally {
                // Always disconnect Redis client
                if (redisClient?.isOpen) {
                    redisClient.destroy();
                }
            }
        }
    }
}
