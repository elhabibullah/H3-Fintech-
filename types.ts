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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
