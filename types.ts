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
  name: string;
  email: string;
  phoneNumber: string;
  kycVerified: boolean;
  biometricEnabled: boolean;
  balance: number;
  currency: string;
  language: 'en' | 'ar';
  profileImage?: string; // Base64 or URL
  address?: string;
  city?: string;
  region?: string;
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