export interface Transaction {
  _id?: string;
  transactionId?: string;
  userId: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: Date;
  wallet?: string;
  description?: string;
  screenshot?: File;
}
