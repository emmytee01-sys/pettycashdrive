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

        // Check and add new columns to loans table
        const [loanColumns]: any = await connection.execute('SHOW COLUMNS FROM loans');
        const columnNames = loanColumns.map((c: any) => c.Field);
        const newCols = [
            'bank_name VARCHAR(100)',
            'account_number VARCHAR(20)',
            'account_name VARCHAR(255)',
            'nin VARCHAR(20)',
            'bvn VARCHAR(20)',
            'nok_name VARCHAR(255)',
            'nok_phone VARCHAR(20)',
            'nok_email VARCHAR(100)',
            'nok_address TEXT',
            'nok_city VARCHAR(100)',
            'nok_state VARCHAR(100)',
            'nok_country VARCHAR(100)'
        ];

        for (const colDef of newCols) {
            const colName = colDef.split(' ')[0];
            if (!columnNames.includes(colName)) {
                await connection.execute(`ALTER TABLE loans ADD COLUMN ${colDef}`);
                console.log(`✅ Added column ${colName} to loans table.`);
            }
        }

        console.log('✅ Database schema verified.');
        
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};
