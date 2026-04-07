import { pool } from './src/config/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

async function seedUserAndLoan() {
    try {
        await pool.query("DELETE FROM users WHERE email = 'tosinoke1801@gmail.com'");
        
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // 1. Create User
        await pool.query(
            'INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, 'Tosin Oke', 'tosinoke1801@gmail.com', hashedPassword, '08165929055', 'user']
        );
        
        // 2. Create Loan (Without interest_rate, but keeping tenure)
        const loanId = uuidv4();
        const ref = "PC-" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        await pool.query(
            'INSERT INTO loans (id, loan_reference, user_id, amount, tenure, status, admin_notes, paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [loanId, ref, userId, 5000000.00, 12, 'disbursed', 'All documents verified and funds transferred.', 0]
        );
        
        // 3. Create Car Details
        const carId = uuidv4();
        await pool.query(
            'INSERT INTO car_details (id, loan_id, make, model, year, plate_number, valuation, is_owner, insurance_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [carId, loanId, 'Mercedes', 'GLE 450', '2023', 'ABC-123-XY', 25000000.00, true, 'Comprehensive']
        );
        
        console.log("Successfully seeded user, loan, and car details.");
        process.exit(0);
    } catch(e) {
        console.error("Seeding Error:", e);
        process.exit(1);
    }
}

seedUserAndLoan();
