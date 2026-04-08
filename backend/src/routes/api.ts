import { Router } from 'express';
import { register, login, getAdminUsers, cleanupSystem } from '../controllers/authController';
import { createLoan, getUserLoans, getLoanDetails, getAdminLoans, updateLoanStatus, addLoanPayment, getAuditLogs, getAdminStats } from '../controllers/loanController';
import { upload } from '../middleware/upload';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Loan Routes
router.post('/loans', upload.fields([
    { name: 'roadworthiness_certificate', maxCount: 1 },
    { name: 'vehicle_license', maxCount: 1 },
    { name: 'proof_of_ownership', maxCount: 1 },
    { name: 'front_photo', maxCount: 1 },
    { name: 'back_photo', maxCount: 1 },
]), createLoan);
router.get('/loans/user/:userId', getUserLoans);
router.get('/loans/:id', getLoanDetails);
router.post('/loans/:id/payment', addLoanPayment);

// Admin Routes
router.get('/admin/loans', getAdminLoans);
router.patch('/admin/loans/:id/status', updateLoanStatus);
router.get('/admin/users', getAdminUsers);
router.get('/admin/audit-logs', getAuditLogs);
router.get('/admin/stats', getAdminStats);
router.post('/admin/cleanup-all-data', cleanupSystem);

export default router;
