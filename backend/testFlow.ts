import { NotificationService } from './src/services/notificationService';
import dotenv from 'dotenv';
dotenv.config();

async function testE2E() {
    try {
        console.log("Starting PettyCash E2E Notification Test...");
        const ref = "PC-" + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        const amount = "5000000";
        const email = "tosinoke1801@gmail.com";
        const phone = "08165929055";
        const name = "Tosin Oke";
        
        console.log(`\n1. Simulating Application Received Alert for ${name}...`);
        await NotificationService.notifyApplicationReceived({ name, email, phone }, ref, Number(amount).toLocaleString());
        
        // Wait 3 seconds to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("\n2. Simulating Admin Approval...");
        await NotificationService.notifyStatusChange({ name, email, phone }, "approved", ref, Number(amount).toLocaleString());
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log("\n3. Simulating Funds Disbursement...");
        await NotificationService.notifyStatusChange({ name, email, phone }, "disbursed", ref, Number(amount).toLocaleString());
        
        console.log("\n✅ All Termii notifications dispatched successfully!");
        process.exit(0);
    } catch(err) {
        console.error("Test Error:", err);
        process.exit(1);
    }
}

testE2E();
