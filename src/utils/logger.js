const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Custom format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),

    transports: [
        // 🔴 Error logs
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error'
        }),

        // 🟢 All logs
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log')
        })
    ]
});

// ✅ Console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                logFormat
            )
        })
    );
}

module.exports = logger;