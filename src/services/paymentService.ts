// Payment service for handling advertisement payments

export interface PaymentMethod {
  id: string;
  name: string;
  type: "bank_transfer" | "cash" | "card" | "mobile_money";
  icon: string;
  instructions: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  reference?: string;
  transactionId?: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: Date;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "bank_transfer",
    name: "Virement Bancaire",
    type: "bank_transfer",
    icon: "🏦",
    instructions: "Effectuez un virement vers:\nBanque: Attijariwafa Bank\nRIB: 007 810 0000123456789012 34\nBénéficiaire: Mobile Morocco SARL",
  },
  {
    id: "cash",
    name: "Paiement en Espèces",
    type: "cash",
    icon: "💵",
    instructions: "Visitez notre bureau à Casablanca pour effectuer le paiement en espèces.",
  },
  {
    id: "card",
    name: "Carte Bancaire",
    type: "card",
    icon: "💳",
    instructions: "Paiement sécurisé par carte bancaire (Visa, Mastercard).",
  },
  {
    id: "mobile_money",
    name: "Mobile Money",
    type: "mobile_money",
    icon: "📱",
    instructions: "Payez via Orange Money, Maroc Telecom Cash, ou inwi money.",
  },
];

/**
 * Process a payment for an advertisement
 */
export const processAdPayment = async (
  adId: string,
  paymentMethod: PaymentMethod,
  amount: number,
  reference?: string
): Promise<PaymentDetails> => {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      const payment: PaymentDetails = {
        method: paymentMethod,
        amount,
        reference: reference || `PAY_${Date.now()}`,
        transactionId: `TXN_${Date.now()}`,
        status: "pending",
        createdAt: new Date(),
      };
      resolve(payment);
    }, 1000);
  });
};

/**
 * Confirm a payment
 */
export const confirmPayment = async (
  transactionId: string
): Promise<boolean> => {
  // In a real app, this would verify the payment with the payment provider
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

/**
 * Calculate total price with discounts
 */
export const calculatePrice = (
  basePrice: number,
  duration: number,
  discountRate: number = 0
): { basePrice: number; discount: number; total: number } => {
  const discount = basePrice * discountRate;
  const total = basePrice - discount;
  
  return {
    basePrice,
    discount,
    total,
  };
};

/**
 * Get payment history for a user
 */
export const getPaymentHistory = async (
  userId: string
): Promise<PaymentDetails[]> => {
  // Mock payment history
  return [
    {
      method: paymentMethods[0],
      amount: 1500,
      reference: "PAY_123456",
      transactionId: "TXN_123456",
      status: "confirmed",
      createdAt: new Date("2024-01-15"),
    },
    {
      method: paymentMethods[2],
      amount: 800,
      reference: "PAY_123457",
      transactionId: "TXN_123457",
      status: "confirmed",
      createdAt: new Date("2024-02-01"),
    },
  ];
};

/**
 * Generate payment receipt
 */
export const generateReceipt = (payment: PaymentDetails): string => {
  return `
    REÇU DE PAIEMENT
    ================
    
    Référence: ${payment.reference}
    Transaction ID: ${payment.transactionId}
    Méthode: ${payment.method.name}
    Montant: ${payment.amount} MAD
    Statut: ${payment.status}
    Date: ${payment.createdAt.toLocaleDateString()}
    
    Merci pour votre paiement!
  `;
};
