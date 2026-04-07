import { pool } from './src/config/db';
async function setupPayments() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id VARCHAR(255) PRIMARY KEY,
                loan_id VARCHAR(255) NOT NULL,
                amount DECIMAL(15, 2) NOT NULL,
                method VARCHAR(50) DEFAULT 'Bank Transfer',
                status VARCHAR(50) DEFAULT 'Successful',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Add "paid" column to loans if it doesn't exist
        try {
            await pool.query('ALTER TABLE loans ADD COLUMN paid DECIMAL(15, 2) DEFAULT 0');
        } catch(e: any) {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
        }
        console.log("Payments schema updated!");
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
setupPayments();
