export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Initialiser le cache handler lors du premier démarrage
        if (
            process.env.CICD_PHASE === undefined
            && process.env.CICD_FIRST_START !== undefined
        ) {
            const { registerInitialCache } = await import('@fortedigital/nextjs-cache-handler/instrumentation');
            const CacheHandler = (await import('../cache-handler.mjs')).default;
            await registerInitialCache(CacheHandler);
        }
    }
}
