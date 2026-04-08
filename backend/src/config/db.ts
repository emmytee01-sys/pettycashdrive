import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pettycash',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully.');
        
        // Auto-migration for audit_logs
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id CHAR(36) PRIMARY KEY,
                admin_id CHAR(36) NOT NULL,
                loan_id CHAR(36) NOT NULL,
                action VARCHAR(100) NOT NULL,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ audit_logs table verified.');
        
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
