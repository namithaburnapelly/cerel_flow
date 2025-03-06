export interface Transfer {
  _id: string;
  transaction_id: string;
  userId: string;
  recipient: string;
  amount: number;
  type: 'to' | 'from';
  date: string; //use string (ISO format)
  description?: string;
}
