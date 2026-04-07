import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';

const logAudit = async (adminId: string | null, loanId: string, action: string, details: string) => {
    try {
        await pool.execute(
            'INSERT INTO audit_logs (id, admin_id, loan_id, action, details) VALUES (?, ?, ?, ?, ?)',
            [uuidv4(), adminId, loanId, action, details]
        );
    } catch (err) {
        console.error('Audit Log Error:', err);
    }
};

const calculateRiskScore = (amount: number, valuation: number, isOwner: boolean) => {
    // 0 = Best (Low Risk), 100 = Worst (High Risk)
    // 1. LTV (Loan to Value Ratio) - weighted 70%
    const ltv = (amount / valuation) * 100;
    
    // 2. Ownership Status - weighted 30%
    const ownershipPenalty = isOwner ? 0 : 30;
    
    const rawScore = (ltv * 0.7) + (ownershipPenalty);
    return Math.min(100, Math.max(0, Math.round(rawScore)));
};

export const createLoan = async (req: Request, res: Response) => {
    // Files are in req.files if using multer.array() or fields
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    const { 
        user_id, 
        amount, 
        tenure, 
        car_make, car_model, car_year, car_plate, 
        is_owner, insurance_type, valuation
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 0. Ensure user exists (especially for mock/demo IDs from frontend)
        const [userExists] : any = await connection.execute('SELECT id FROM users WHERE id = ?', [user_id]);
        if (userExists.length === 0) {
            console.log(`User ${user_id} not found, creating a mock user record to satisfy foreign key...`);
            await connection.execute(
                'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [user_id, 'Guest User', `guest_${user_id.substring(0,6)}@pettycash.com.ng`, 'mock_password', 'user']
            );
        }

        // 1. Create Loan Record
        const loanId = uuidv4();
        const loanReference = `PC-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        
        await connection.execute(
            'INSERT INTO loans (id, user_id, amount, tenure, loan_reference, status) VALUES (?, ?, ?, ?, ?, ?)',
            [loanId, user_id, amount, tenure || 12, loanReference, 'pending']
        );

        // 2. Store Car Details
        const carDetailsId = uuidv4();
        await connection.execute(
            'INSERT INTO car_details (id, loan_id, make, model, year, plate_number, is_owner, insurance_type, valuation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [carDetailsId, loanId, car_make, car_model, car_year, car_plate || '', is_owner === 'true' || is_owner === true, insurance_type || 'none', valuation || parseFloat(amount) * 1.5]
        );

        // 3. Store Documents (File Uploads)
        if (files) {
            // Handle different multer formats (array or fields)
            const fileList = Array.isArray(files) ? files : Object.values(files).flat();
            
            for (const file of fileList) {
                const docId = uuidv4();
                // Map fieldname to a cleaner document type name if needed
                const docType = file.fieldname; 
                
                await connection.execute(
                    'INSERT INTO documents (id, loan_id, document_type, file_url, status) VALUES (?, ?, ?, ?, ?)',
                    [docId, loanId, docType, `/uploads/${file.filename}`, 'pending']
                );
            }
        }

        await connection.commit();

        // 4. Send Immediate Notification (Email & SMS)
        try {
            const [userRows]: any = await pool.execute('SELECT name, email, phone FROM users WHERE id = ?', [user_id]);
            if (userRows.length > 0) {
                const user = userRows[0];
                await NotificationService.notifyApplicationReceived(
                    { name: user.name, email: user.email, phone: user.phone },
                    loanReference,
                    Number(amount).toLocaleString()
                );
            }
        } catch (noticeErr) {
            console.error('Non-critical Notification Error:', noticeErr);
        }

        res.status(201).json({
            message: 'Loan application and documents submitted successfully.',
            loan_id: loanId,
            reference: loanReference
        });
    } catch (error) {
        await connection.rollback();
        console.error('Loan/Document Creation Error:', error);
        res.status(500).json({ message: 'Submission failed. Please check your inputs and files.' });
    } finally {
        connection.release();
    }
};

export const getLoanDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [loans]: any = await pool.execute('SELECT l.*, u.name FROM loans l JOIN users u ON l.user_id = u.id WHERE l.id = ?', [id]);
        if (loans.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        const [carDetails]: any = await pool.execute('SELECT * FROM car_details WHERE loan_id = ?', [id]);
        const [docs]: any = await pool.execute('SELECT * FROM documents WHERE loan_id = ?', [id]);
        const [history]: any = await pool.execute('SELECT id, payment_date as date, amount, payment_method as method, status FROM payments WHERE loan_id = ? ORDER BY payment_date DESC', [id]);

        res.json({
            ...loans[0],
            car: carDetails[0] || null,
            documents: docs,
            history: history
        });
    } catch (error) {
        console.error('Fetch Loan Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserLoans = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const [loans]: any = await pool.execute('SELECT * FROM loans WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(loans);
    } catch (error) {
        console.error('Fetch User Loans Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdminLoans = async (req: Request, res: Response) => {
    try {
        const [loans]: any = await pool.execute(`
            SELECT 
                l.*, 
                u.name as user_name, u.email as user_email, u.phone as user_phone,
                c.make, c.model, c.year, c.plate_number, c.valuation, c.is_owner, c.insurance_type,
                (
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('id', d.id, 'type', d.document_type, 'url', d.url))
                    FROM (
                        SELECT id, document_type, file_url as url FROM documents WHERE loan_id = l.id
                    ) d
                ) as documents
            FROM loans l
            JOIN users u ON l.user_id = u.id
            LEFT JOIN car_details c ON l.id = c.loan_id
            ORDER BY l.created_at DESC
        `);
        
        const enriched = loans.map((l: any) => ({
            ...l,
            risk_index: calculateRiskScore(Number(l.amount), Number(l.valuation || (Number(l.amount) * 1.5)), l.is_owner === 1 || l.is_owner === true)
        }));

        res.json(enriched);
    } catch (error) {
        console.error('Fetch Admin Loans Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

import { NotificationService } from '../services/notificationService';

export const updateLoanStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body; // 'approved', 'rejected', etc.

    if (!['pending', 'approved', 'rejected', 'disbursed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // 1. Update status in DB
        await pool.execute('UPDATE loans SET status = ?, admin_notes = ? WHERE id = ?', [status, notes || null, id]);

        // 2. Log Action in Audit
        await logAudit('Admin-001', String(id), 'STATUS_UPDATE', `Changed status to ${status}. Notes: ${notes || 'none'}`);

        // 3. Fetch User and Loan details for notification
        const [rows]: any = await pool.execute(`
            SELECT 
                u.name, u.email, u.phone, 
                l.loan_reference, l.amount 
            FROM loans l 
            JOIN users u ON l.user_id = u.id 
            WHERE l.id = ?
        `, [id]);

        if (rows.length > 0) {
            const row = rows[0];
            // Trigger notifications (Email & SMS)
            await NotificationService.notifyStatusChange(
                { name: row.name, email: row.email, phone: row.phone },
                status,
                row.loan_reference,
                Number(row.amount).toLocaleString()
            );
        }

        res.json({ message: `Loan status updated to ${status}` });
    } catch (error) {
        console.error('Update Loan Status Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addLoanPayment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, method } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check loan exists
        const [loans]: any = await connection.execute('SELECT id, amount, paid FROM loans WHERE id = ?', [id]);
        if (loans.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        const paymentId = uuidv4();
        await connection.execute(
            'INSERT INTO payments (id, loan_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)',
            [paymentId, id, amount, method || 'Bank Transfer', 'successful']
        );

        await connection.execute(
            'UPDATE loans SET paid = paid + ? WHERE id = ?',
            [amount, id]
        );

        await connection.commit();
        res.status(201).json({ message: 'Payment recorded successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Payment Error:', error);
        res.status(500).json({ message: 'Payment processing failed' });
    } finally {
        connection.release();
    }
};

export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const [logs]: any = await pool.execute(`
            SELECT a.*, u.name as admin_name 
            FROM audit_logs a
            LEFT JOIN users u ON a.admin_id = u.id
            ORDER BY a.created_at DESC
            LIMIT 50
        `);
        res.json(logs);
    } catch (error) {
        console.error('Fetch Audit Logs Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
