# LIB: LOGGER
**Version française :** [README-FR.md](README-FR.md)


## Overview
These utilities centralise logging across the project. They should replace any
`console` statements that need to remain in the codebase. Feel free to use
`console.log` while debugging, but never commit it. If you need persistent logs,
use one of the loggers below instead.

## Table of Contents
- [Configuration](#configuration)
- [serverLogger](#serverlogger)
- [clientLogger](#clientlogger)

## Configuration
Both loggers output messages formatted as:

```
YYYY-MM-DD HH:mm:ss,SSS LEVEL [context]: message {metadata}
```

The `context` field in the metadata allows grouping logs. When used with
`serverLogger` it creates a dedicated file inside `logs/` named
`<context>-YYYY-MM-DD.log`. Rotating files are kept for seven days.

## serverLogger
`serverLogger` is a Winston based logger for **server side code only**.
It writes to the console and to daily rotating files when a context is
provided. Use it in Server Components, API routes or Server Actions, never in
client code.

```ts
import serverLogger from '@/lib/logger/serverLogger';

// simple informational message
serverLogger.info('Notification service started');

// warning with metadata
serverLogger.warn('Redis cache unavailable', { service: 'cache' });

// debug message (only visible in development)
serverLogger.debug('Data received from API', { payload });

// error with stack trace
try {
    await doSomething();
} catch (error) {
    serverLogger.error('Operation failed', { context: 'something', error });
}
```

## clientLogger
`clientLogger` provides the same interface for browser code. It never writes to
files and respects the `LOG_LEVEL` available on `window`. Use it inside React
components or other client side scripts. Example inside a React hook:

```tsx
import { useEffect } from 'react';
import clientLogger from '@/lib/logger/clientLogger';

export default function MyComponent() {
    useEffect(() => {
        clientLogger.info('component mounted', { context: 'ui' });
    }, []);
    return <div />;
}
```
