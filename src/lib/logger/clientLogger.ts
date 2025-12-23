/**
 * Lightweight logger for client side code. It mimics the formatting of
 * `dynamicLogger` but only outputs to the browser console.
 */
/** Additional information that can accompany a log entry in the browser. */
interface LogMetadata {
    /** Optional context displayed in the log output. */
    context?: string;
    /** Optional error to output the stack trace. */
    error?: Error | any;
    /** Any extra structured data. */
    [key: string]: any;
}

/** Formats a Date into the timestamp used in the log output. */
const timestampFormat = (date: Date): string => {
    // Format: YYYY-MM-DD HH:mm:ss,SSS
    const pad = (n: number, width = 2) => n.toString().padStart(width, '0');
    return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds()) +
        ',' +
        pad(date.getMilliseconds(), 3)
    );
};

// Map log levels to numeric severity for filtering
/** Numerical priority assigned to each log level. */
const levelPriority: Record<string, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

/** Minimal level displayed according to environment or window.LOG_LEVEL. */
const envLevel = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_LOGGER_LEVEL)
    ? process.env.NEXT_PUBLIC_LOGGER_LEVEL.toLowerCase()
    : typeof window !== 'undefined' && (window as any).LOG_LEVEL
        ? (window as any).LOG_LEVEL.toLowerCase()
        : typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
            ? 'debug'
            : 'info';

/** Resolved numeric priority for the current environment. */
const currentLevelPriority = levelPriority[envLevel] ?? 2;

/** Formats a log entry into a single string. */
const formatLog = (
    level: string,
    message: string,
    metadata?: LogMetadata
): string => {
    let levelString = level.toUpperCase();
    if (levelString === 'WARN') {
        levelString = 'WARNING';
    }

    const timestamp = timestampFormat(new Date());

    let log = `${timestamp} ${levelString}`;
    if (metadata?.context) {
        log += ` [${metadata.context}]`;
        delete metadata.context;
    }
    // Prefer stack trace if available
    const hasStack = metadata?.error && metadata.error.stack;
    const logMessage = hasStack ? metadata.error.stack : message;
    log += `: ${logMessage}`;

    // Copy metadata except error (uniquement si le stack a été utilisé)
    const metadataCopy = { ...metadata };
    if (hasStack && 'error' in metadataCopy) {
        delete metadataCopy.error;
    }
    if (Object.keys(metadataCopy).length > 0) {
        log += ` ${JSON.stringify(metadataCopy)}`;
    }
    return log;
};

/** Object exposing the logging methods used on the client side. */
const logger = {
    info: (message: string, metadata?: LogMetadata) => {
        if (currentLevelPriority >= levelPriority.info) {
            console.info(formatLog('info', message, metadata));
        }
    },
    warn: (message: string, metadata?: LogMetadata) => {
        if (currentLevelPriority >= levelPriority.warn) {
            console.warn(formatLog('warn', message, metadata));
        }
    },
    error: (message: string, metadata?: LogMetadata) => {
        if (currentLevelPriority >= levelPriority.error) {
            console.error(formatLog('error', message, metadata));
        }
    },
    debug: (message: string, metadata?: LogMetadata) => {
        if (currentLevelPriority >= levelPriority.debug) {
            console.debug(formatLog('debug', message, metadata));
        }
    },
};

export default logger;
