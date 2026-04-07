
const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com';
const EMAIL_CONFIG_ID = process.env.TERMII_EMAIL_CONFIG_ID;
const EMAIL_TEMPLATE_ID = process.env.TERMII_EMAIL_TEMPLATE_ID;
const APP_RECEIVED_TEMPLATE_ID = process.env.TERMII_EMAIL_APP_RECEIVED_ID || EMAIL_TEMPLATE_ID;
const DISBURSED_TEMPLATE_ID = process.env.TERMII_EMAIL_DISBURSED_ID || EMAIL_TEMPLATE_ID;
const DECLINED_TEMPLATE_ID = process.env.TERMII_EMAIL_DECLINED_ID || EMAIL_TEMPLATE_ID;

export class NotificationService {
  /**
   * Send SMS notification
   */
  static async sendSMS(to: string, message: string) {
    try {
      // Ensure phone is in international format for Nigeria (Termii requirement)
      let formattedPhone = to.trim();
      if (formattedPhone.startsWith('0')) {
          formattedPhone = '234' + formattedPhone.slice(1);
      }

      const data = {
        to: formattedPhone,
        from: "Paymyrent",
        sms: message,
        type: "plain",
        api_key: TERMII_API_KEY,
        channel: "generic",
      };

      const response = await fetch(`${TERMII_BASE_URL}/api/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const resData = await response.json();
      console.log('SMS status:', resData);
      return resData;
    } catch (error: any) {
      console.error('Error sending SMS via Termii:', error.message);
    }
  }

  /**
   * Send Email notification using template
   */
  static async sendEmail(email: string, subject: string, variables: Record<string, string>, specificTemplateId?: string) {
    try {
      const data = {
        template_id: specificTemplateId || EMAIL_TEMPLATE_ID,
        email_configuration_id: EMAIL_CONFIG_ID,
        api_key: TERMII_API_KEY,
        email,
        subject,
        variables
      };

      const response = await fetch(`${TERMII_BASE_URL}/api/templates/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });

      const resData = await response.json();
      console.log('Email status:', resData);
      return resData;
    } catch (error: any) {
      console.error('Error sending Email via Termii:', error.message);
    }
  }

  /**
   * Notify user when loan application is received
   */
  static async notifyApplicationReceived(user: { name: string, email: string, phone: string }, ref: string, amount: string) {
     const smsText = `Hi ${user.name}, your PettyCash loan application (Ref: ${ref}) for N${amount} has been received. Our team will review it within 24 hours.`;
     await this.sendSMS(user.phone, smsText);

     const emailVariables = {
        name: user.name,
        balance: amount,
        loan_ref: ref,
        status: "RECEIVED",
        current_year: new Date().getFullYear().toString(),
        company_name: "PettyCash"
     };
     await this.sendEmail(user.email, `Application Received: #${ref}`, emailVariables, APP_RECEIVED_TEMPLATE_ID);
  }

  /**
   * Notify user about loan status change
   */
  static async notifyStatusChange(user: { name: string, email: string, phone: string }, status: string, ref: string, amount: string) {
    const statusMsg = status.toUpperCase();
    const smsText = `Hi ${user.name}, your PettyCash loan #${ref} of N${amount} has been ${statusMsg}. Check your dashboard for details.`;
    await this.sendSMS(user.phone, smsText);

    const emailVariables = {
       name: user.name,
       balance: amount,
       loan_ref: ref,
       status: statusMsg,
       current_year: new Date().getFullYear().toString(),
       company_name: "PettyCash"
    };

    // Use specific theme for Disbursement if available
    let targetTemplate = EMAIL_TEMPLATE_ID;
    let emailSubject = `Loan Application Update: #${ref}`;

    if (status === 'disbursed') {
       targetTemplate = DISBURSED_TEMPLATE_ID;
       emailSubject = `PettyCash Payment Alert: #${ref}`;
    } else if (status === 'rejected') {
       targetTemplate = DECLINED_TEMPLATE_ID;
       emailSubject = `Update on your Loan Application: #${ref}`;
    }

    await this.sendEmail(user.email, emailSubject, emailVariables, targetTemplate);
  }

  /**
   * Notify user about payment received
   */
  static async notifyPaymentReceived(user: { name: string, email: string, phone: string }, amount: string, ref: string, balance: string) {
    const smsText = `Payment Confirmed: N${amount} received for PettyCash loan #${ref}. Your outstanding balance is now N${balance}. Thank you!`;
    await this.sendSMS(user.phone, smsText);

    const emailVariables = {
       name: user.name,
       amount_paid: amount,
       loan_ref: ref,
       outstanding_balance: balance,
       current_year: new Date().getFullYear().toString(),
       company_name: "PettyCash"
    };

    await this.sendEmail(user.email, `Payment Confirmation: #${ref}`, emailVariables);
  }

  /**
   * Notify user when account is created successfully
   */
  static async notifyAccountCreated(user: { name: string, email: string, phone: string }) {
    const smsText = `Hi ${user.name}, welcome to PettyCash! Your account has been created successfully. Log in to start exploring our loan services.`;
    await this.sendSMS(user.phone, smsText);

    const emailVariables = {
       name: user.name,
       action: "Account Creation",
       status: "SUCCESS",
       current_year: new Date().getFullYear().toString(),
       company_name: "PettyCash"
    };
    await this.sendEmail(user.email, `Welcome to PettyCash, ${user.name}!`, emailVariables, EMAIL_TEMPLATE_ID);
  }

  /**
   * Sample SMS Triggers (for dashboard reference):
   * 
   * 1. Application Received: 
   *    "Hi [Name], your PettyCash loan application (Ref: [Ref]) for N[Amount] has been received. Our team will review it within 24 hours."
   * 
   * 2. Loan Approved:
   *    "Congratulations [Name]! Your PettyCash loan #[Ref] of N[Amount] has been APPROVED. We are now processing the disbursement."
   * 
   * 3. Funds Disbursed:
   *    "Payment Alert: N[Amount] has been disbursed for your PettyCash loan #[Ref]. Please check your bank account."
   * 
   * 4. Loan Declined:
   *    "Hi [Name], unfortunately your PettyCash loan #[Ref] was not approved at this time. Check your dashboard for details."
   */
}
