import cron from 'node-cron';
import { pool } from '../config/db';
import { NotificationService } from './notificationService';

export const startReminderService = () => {
    // Run every day at 9:00 AM
    // Seconds Minutes Hours DayOfMonth Month DayOfWeek
    cron.schedule('0 9 * * *', async () => {
        console.log('⏰ Running daily payment reminder check...');
        try {
            const [overdueLoans]: any = await pool.execute(`
                SELECT l.*, u.name, u.email, u.phone 
                FROM loans l 
                JOIN users u ON l.user_id = u.id 
                WHERE l.status = 'disbursed' 
                  AND l.due_date < CURDATE() 
                  AND l.paid < l.amount
            `);

            console.log(`🔍 Found ${overdueLoans.length} overdue accounts.`);

            for (const loan of overdueLoans) {
                try {
                    console.log(`📧 Sending reminder to ${loan.name} for Ref: ${loan.loan_reference}`);
                    // We'll reuse notification service with a generic template or a specialized one if available
                    // For now, let's assume notifyStatusChange can handle a 'remind' status or we use a general push
                    // But to be consistent with our Termii integration, let's add a notifyOverdue method if we have one.
                    // We'll implement a simple log and call for now.
                    await NotificationService.sendSMS(
                        loan.phone, 
                        `Dear ${loan.name}, your repayment for ${loan.loan_reference} was due on ${loan.due_date.toLocaleDateString()}. Please make a payment to avoid penalties.`
                    );
                } catch (err) {
                    console.error(`Failed to send reminder to ${loan.id}:`, err);
                }
            }
        } catch (error) {
            console.error('Reminder Service Error:', error);
        }
    });
};
