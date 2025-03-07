export interface Transaction {
  _id: string;
  transaction_id: string;
  userId: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string; //use string (ISO format)
  description?: string;
  screenshot?: File;
}
