interface BasicDetails {
  _id?: string;
  userId: string;
  date: Date;
  wallet?: string;
  description?: string;
  amount: number;
  screenshot?: File;
}
export interface Transaction extends BasicDetails {
  type: 'Income' | 'Expense';
  category: string;
}

export interface Transfer extends BasicDetails {
  toWhom: string;
}
