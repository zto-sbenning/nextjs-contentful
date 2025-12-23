import winston, { Logger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

/**
 * Winston based logger that writes to the console and optionally to daily
 * rotating log files based on the provided `context` metadata.
 *
 * This logger **must only** be used in server side code. When a `context` is
 * provided in the log metadata, a dedicated log file is created under
 * `logs/` with the name `<context>-YYYY-MM-DD.log`. Logs are formatted as
 * `timestamp LEVEL [context]: message {metadata}`.
 */

const logDirectory = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const timestampFormat = 'YYYY-MM-DD HH:mm:ss,SSS';
// Keep track of which file transports have been created
const createdProcessTransports = new Set<string>();

const logLevel = process.env.NEXT_PUBLIC_LOGGER_LEVEL
    ? process.env.NEXT_PUBLIC_LOGGER_LEVEL.toLowerCase()
    : process.env.NODE_ENV === 'development'
        ? 'debug'
        : 'info';

const colorizer = format.colorize();

/**
 * Formats a log entry into a readable string used both for console output and
 * file logging.
 */
const textLogFormat = format.printf(({ level, message, timestamp, stack, context, ...metadata }) => {
    let levelString = level.toUpperCase();

    if (levelString === 'WARN') {
        levelString = 'WARNING';
    }

    levelString = colorizer.colorize(level, levelString);

    let log = `${timestamp} ${levelString}`;
    if (context) {
        log += ` [${context}]`;
    }
    log += `: ${stack ? stack : message}`

    const metadataToLog = { ...metadata };
    // Ne supprimer 'error' que si Winston l'a déjà traité (stack présent)
    if (stack && 'error' in metadataToLog) {
        delete metadataToLog.error;
    }
    const metaString = Object.keys(metadataToLog).length ? ` ${JSON.stringify(metadataToLog)}` : '';
    return log + metaString;
});

/** Base Winston format used for both console and file transports. */
const baseFormat = format.combine(
    format.timestamp({ format: timestampFormat }),
    format.errors({ stack: true }),
    format.splat()
);

// Context-based filter
/** Options for the custom filter used to route logs by context. */
interface ProcessFilterOptions {
    /** Context name used to match log entries. */
    processType: string;
}
const processTypeFilter = format((info, opts: unknown) => {
    const options = opts as ProcessFilterOptions | undefined;
    if (!options?.processType) return false;
    return info.context === options.processType ? info : false;
});

// Transport creation functions
/**
 * Creates a rotating file transport for the provided process context.
 *
 * @param processType - Context name used to name the log file.
 */
function createProcessSpecificFileTransport(processType: string): winston.transport {
    return new transports.DailyRotateFile({
        level: logLevel,
        dirname: logDirectory,
        filename: `${processType}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '7d',
        format: format.combine(
            processTypeFilter({ processType }),
            baseFormat,
            textLogFormat
        ),
    });
}

// Main logger instance
/** Winston logger configured with console transport by default. */
const _logger: Logger = winston.createLogger({
    level: logLevel,
    transports: [
        new transports.Console({
            format: format.combine(
                baseFormat,
                textLogFormat
            ),
        }),
    ],
    exitOnError: false,
});

/** Additional information that can accompany a log entry. */
interface LogMetadata {
    /** Optional context used to create a dedicated log file. */
    context?: string;
    /** Error object to log. The stack trace is included automatically. */
    error?: Error | any;
    /** Any extra structured data. */
    [key: string]: any;
}

/**
 * Logs a message and dynamically creates a file transport when a new context
 * is encountered.
 */
const logWithDynamicFile = (
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    metadata?: LogMetadata
): void => {
    const context = metadata?.context;

    if (context && !createdProcessTransports.has(context)) {
        console.log(`[Logger Setup] Creating transport for context: ${context}`);
        try {
            const newTransport = createProcessSpecificFileTransport(context);
            _logger.add(newTransport);
            createdProcessTransports.add(context);
        } catch (error) {
            const errorMsg = `[Logger Setup] Failed to create transport for ${context}`;
            console.error(errorMsg, error);
            _logger.error(errorMsg, { error: error instanceof Error ? error : new Error(String(error)) });
        }
    }

    _logger[level](message, metadata);
};

// Exported logger interface
/** Object exposing the logging methods used throughout the server code. */
const logger = {
    info: (message: string, metadata?: LogMetadata) => logWithDynamicFile('info', message, metadata),
    warn: (message: string, metadata?: LogMetadata) => logWithDynamicFile('warn', message, metadata),
    error: (message: string, metadata: LogMetadata) => logWithDynamicFile('error', message, metadata),
    debug: (message: string, metadata?: LogMetadata) => logWithDynamicFile('debug', message, metadata),
};

export default logger;