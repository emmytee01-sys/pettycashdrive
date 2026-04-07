import { pool } from './src/config/db';
import { v4 as uuidv4 } from 'uuid';

async function migrate() {
    try {
        console.log("Starting Migration: Audit Logs, Loan Meta...");
        
        // 1. Audit Logs Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS audit_logs (
                id CHAR(36) PRIMARY KEY,
                admin_id CHAR(36),
                loan_id CHAR(36),
                action VARCHAR(255),
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Audit Logs table created.");

        // 2. Add due_date to loans if not exists
        const [columns]: any = await pool.query("SHOW COLUMNS FROM loans LIKE 'due_date'");
        if (columns.length === 0) {
            await pool.query("ALTER TABLE loans ADD COLUMN due_date DATE AFTER amount");
            console.log("✅ Added 'due_date' column to loans.");
        }

        // 3. Update existing loans to have a due_date (e.g., 30 days from now)
        await pool.query("UPDATE loans SET due_date = DATE_ADD(created_at, INTERVAL 30 DAY) WHERE due_date IS NULL");

        console.log("🚀 Migration Complete.");
        process.exit(0);
    } catch(err) {
        console.error("❌ Migration Failed:", err);
        process.exit(1);
    }
}
migrate();
