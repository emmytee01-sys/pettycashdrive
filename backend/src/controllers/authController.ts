import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { NotificationService } from '../services/notificationService';

export const register = async (req: Request, res: Response) => {
    const { name, email, password, phone, role, link_loan_id } = req.body;
    
    try {
        // Check if user exists
        const [existingUser]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Create user
        await pool.execute(
            'INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name || 'User', email, hashedPassword, phone || '', role || 'user']
        );

        // Link loan if provided
        if (link_loan_id) {
            console.log(`Linking loan ${link_loan_id} to new user ${userId}`);
            await pool.execute('UPDATE loans SET user_id = ? WHERE id = ?', [userId, link_loan_id]);
        }

        // Notify user about account creation
        try {
            await NotificationService.notifyAccountCreated({ name: name || 'User', email, phone: phone || '' });
        } catch (noticeErr) {
            console.error('Non-critical generic welcome notice error:', noticeErr);
        }

        // Create Token
        const token = jwt.sign({ id: userId, role: role || 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, name, email, role: role || 'user' }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const [users]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAdminUsers = async (req: Request, res: Response) => {
    try {
        const [users]: any = await pool.execute(`
            SELECT 
                u.id, u.name, u.email, u.phone, u.role, u.created_at,
                (SELECT status FROM loans WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) as loan_status
            FROM users u
            WHERE u.role != 'admin'
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        console.error('Fetch Admin Users Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const cleanupSystem = async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        console.log('--- STARTING DATABASE CLEANUP ---');

        // 1. Delete dependent records (Car details and Docs)
        await connection.execute('DELETE FROM car_details');
        await connection.execute('DELETE FROM documents');
        await connection.execute('DELETE FROM audit_logs');
        await connection.execute('DELETE FROM payments');
        
        // 2. Delete Loans
        await connection.execute('DELETE FROM loans');

        // 3. Delete Users except admins
        // roles to keep: 'admin', 'superadmin', 'manager' (standard admin roles)
        await connection.execute("DELETE FROM users WHERE role NOT IN ('admin', 'superadmin', 'manager')");

        await connection.commit();
        console.log('--- CLEANUP COMPLETED ---');
        res.json({ message: 'System cleaned successfully. All loans and non-admin users removed.' });
    } catch (error: any) {
        await connection.rollback();
        console.error('Cleanup Error:', error);
        res.status(500).json({ message: 'Cleanup failed', error: error.message });
    } finally {
        connection.release();
    }
};
