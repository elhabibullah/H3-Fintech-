export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  ZAKAT = 'ZAKAT',
  RECEIVE = 'RECEIVE'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  recipient?: string;
  sender?: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
}

export interface UserProfile {
  // Identity
  title?: 'Mr' | 'Mrs';
  firstName?: string;
  lastName?: string;
  name: string; // Display name (derived from First + Last)
  
  // Contact
  email: string;
  phoneNumber: string;
  
  // Status
  kycVerified: boolean;
  biometricEnabled: boolean;
  
  // Financial
  balance: number;
  currency: string;
  bankName?: string;
  iban?: string;
  
  // Settings
  language: 'en' | 'ar';
  profileImage?: string; // Base64 or URL
  
  // Address
  address?: string; // Official address
  city?: string;    // City / Municipality
  region?: string;  // Province / Region
  postcode?: string;
  country?: string;
}

export interface VirtualCard {
  id: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  holderName: string;
  type: 'VISA' | 'MASTERCARD';
  status: 'ACTIVE' | 'FROZEN';
  color: 'SILVER' | 'BLACK' | 'GOLD';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}