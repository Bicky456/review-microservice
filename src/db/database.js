const mysql = require('mysql2/promise');

let pool;

/**
 * Initialize MySQL Connection Pool
 */
const initDatabase = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,

            waitForConnections: true,
            connectionLimit: 10, // good for microservice
            queueLimit: 0,

            // recommended
            connectTimeout: 10000
        });

        // Test connection
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected Successfully');
        connection.release();

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
};

/**
 * Get pool instance
 */
const getDB = () => {
    if (!pool) {
        throw new Error('Database not initialized. Call initDatabase first.');
    }
    return pool;
};

module.exports = {
    initDatabase,
    getDB
};