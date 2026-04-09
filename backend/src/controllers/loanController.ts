import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/db';
import { NotificationService } from '../services/notificationService';

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
    const ltv = (amount / (valuation || amount * 1.5)) * 100;
    const ownershipPenalty = isOwner ? 0 : 30;
    const rawScore = (ltv * 0.7) + (ownershipPenalty);
    return Math.min(100, Math.max(0, Math.round(rawScore)));
};

const enrichLoanData = (loan: any) => {
    const principal = Number(loan.amount);
    const interestRate = 0.035; // 3.5% per month
    const tenure = Number(loan.tenure) || 1;
    
    const totalPayback = principal + (principal * interestRate * tenure);
    const monthlyPayment = totalPayback / tenure;
    const amountPaid = Number(loan.amount_paid || 0);
    const remainingBalance = totalPayback - amountPaid;

    // Repayment Plan Generation
    const repaymentPlan = [];
    for (let i = 0; i < tenure; i++) {
        const dueDate = new Date(loan.created_at);
        dueDate.setMonth(dueDate.getMonth() + i + 1);
        
        const isPaid = amountPaid >= (monthlyPayment * (i + 1)) - 0.01;
        const isMissed = !isPaid && new Date() > dueDate;

        repaymentPlan.push({
            month: `Month ${i+1}`,
            amount: monthlyPayment,
            due_date: dueDate.toISOString(),
            status: isPaid ? 'Paid' : (isMissed ? 'Missed' : 'Upcoming')
        });
    }

    // Next Payment Date logic: Month N+1 if they have paid N months
    const monthsPaid = Math.floor(amountPaid / (monthlyPayment - 0.01));
    const nextPaymentDate = new Date(loan.created_at);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + monthsPaid + 1);

    const finalPayoutDate = new Date(loan.created_at);
    finalPayoutDate.setMonth(finalPayoutDate.getMonth() + tenure);

    return {
        ...loan,
        interest_rate: "3.5%",
        amount_disbursed: principal,
        total_payback: totalPayback,
        monthly_payment: monthlyPayment,
        remaining_balance: remainingBalance,
        next_payment_date: nextPaymentDate.toISOString(),
        final_payout_date: finalPayoutDate.toISOString(),
        repayment_plan: repaymentPlan,
        risk_index: calculateRiskScore(principal, Number(loan.valuation), loan.is_owner === 1 || loan.is_owner === true)
    };
};

export const createLoan = async (req: Request, res: Response) => {
    // Files are in req.files if using multer.array() or fields
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    const { 
        user_id, 
        amount, 
        tenure, 
        car_make, car_model, car_year, car_plate, 
        is_owner, insurance_type, valuation,
        bank_name, account_number, account_name, nin, bvn,
        nok_name, nok_phone, nok_email, nok_address, nok_city, nok_state, nok_country
    } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Ensure user exists
        const [userExists] : any = await connection.execute('SELECT id FROM users WHERE id = ?', [user_id]);
        if (userExists.length === 0) {
            await connection.execute(
                'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [user_id, 'Guest User', `guest_${user_id.substring(0,6)}@pettycash.com.ng`, 'mock_password', 'user']
            );
        }

        const loanId = uuidv4();
        const loanReference = `PC-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        
        await connection.execute(
            `INSERT INTO loans (
                id, user_id, amount, tenure, loan_reference, status,
                bank_name, account_number, account_name, nin, bvn,
                nok_name, nok_phone, nok_email, nok_address, nok_city, nok_state, nok_country
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                loanId, user_id, amount, tenure || 12, loanReference, 'pending',
                bank_name || '', account_number || '', account_name || '', nin || '', bvn || '',
                nok_name || '', nok_phone || '', nok_email || '', nok_address || '', nok_city || '', nok_state || '', nok_country || ''
            ]
        );

        const carDetailsId = uuidv4();
        await connection.execute(
            'INSERT INTO car_details (id, loan_id, make, model, year, plate_number, is_owner, insurance_type, valuation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [carDetailsId, loanId, car_make, car_model, car_year, car_plate || '', is_owner === 'true' || is_owner === true, insurance_type || 'none', valuation || parseFloat(amount) * 1.5]
        );

        if (files) {
            const fileList = Array.isArray(files) ? files : Object.values(files).flat();
            for (const file of fileList) {
                const docId = uuidv4();
                await connection.execute(
                    'INSERT INTO documents (id, loan_id, document_type, file_url, status) VALUES (?, ?, ?, ?, ?)',
                    [docId, loanId, file.fieldname, `/uploads/${file.filename}`, 'pending']
                );
            }
        }

        await connection.commit();

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
        } catch (noticeErr) {}

        res.status(201).json({
            message: 'Loan application submitted successfully.',
            loan_id: loanId,
            reference: loanReference
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Submission failed.' });
    } finally {
        connection.release();
    }
};

export const getLoanDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [loans]: any = await pool.execute(`
            SELECT 
                l.*, u.name as user_name,
                c.make, c.model, c.year, c.plate_number, c.valuation, c.is_owner,
                IFNULL((SELECT SUM(amount) FROM payments WHERE loan_id = l.id AND status = 'successful'), 0) as amount_paid
            FROM loans l 
            JOIN users u ON l.user_id = u.id 
            LEFT JOIN car_details c ON l.id = c.loan_id
            WHERE l.id = ?
        `, [id]);
        
        if (loans.length === 0) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        const loan = loans[0];
        const [docs]: any = await pool.execute('SELECT id, document_type as type, file_url as url FROM documents WHERE loan_id = ?', [id]);
        const [history]: any = await pool.execute('SELECT id, payment_date as date, amount, payment_method as method, status FROM payments WHERE loan_id = ? ORDER BY payment_date DESC', [id]);

        res.json({
            ...enrichLoanData(loan),
            car: {
                make: loan.make,
                model: loan.model,
                year: loan.year,
                plate_number: loan.plate_number,
                valuation: loan.valuation,
                is_owner: loan.is_owner
            },
            documents: docs,
            history: history
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUserLoans = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const [loans]: any = await pool.execute(`
            SELECT 
                l.*,
                c.make, c.model, c.year, c.plate_number, c.valuation, c.is_owner,
                IFNULL((SELECT SUM(amount) FROM payments WHERE loan_id = l.id AND status = 'successful'), 0) as amount_paid
            FROM loans l 
            LEFT JOIN car_details c ON l.id = c.loan_id
            WHERE l.user_id = ? 
            ORDER BY l.created_at DESC
        `, [userId]);
        
        res.json(loans.map((l: any) => enrichLoanData(l)));
    } catch (error) {
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
                ) as documents,
                IFNULL((SELECT SUM(amount) FROM payments WHERE loan_id = l.id AND status = 'successful'), 0) as amount_paid
            FROM loans l
            JOIN users u ON l.user_id = u.id
            LEFT JOIN car_details c ON l.id = c.loan_id
            ORDER BY l.created_at DESC
        `);
        
        res.json(loans.map((l: any) => enrichLoanData(l)));
    } catch (error) {
        console.error('Fetch Admin Loans Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const [loanStats]: any = await pool.execute(`
            SELECT 
                COUNT(*) as total_loans,
                SUM(CASE WHEN status = 'disbursed' THEN amount ELSE 0 END) as total_disbursed,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as total_pending,
                SUM(amount) as total_capital
            FROM loans
        `);

        const [userStats]: any = await pool.execute('SELECT COUNT(*) as total_users FROM users WHERE role = "user"');
        
        const [paymentStats]: any = await pool.execute('SELECT SUM(amount) as total_received FROM payments WHERE status = "successful"');

        res.json({
            loans: loanStats[0],
            users: userStats[0],
            payments: paymentStats[0]
        });
    } catch (error) {
        console.error('Fetch Admin Stats Error:', error);
        res.status(500).json({ message: 'Internal server error' });
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
