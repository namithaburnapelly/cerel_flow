export interface Category {
  icon: string;
  color: string;
}

export const CATEGORY_MAP: Record<string, Category> = {
  Salary: { icon: 'wallet-minimal', color: '#1f618d' },
  'Business Income': { icon: 'handshake', color: '#ffd166' },
  'Gifts & Rewards': { icon: 'gift', color: '#ffd60a' },
  Investments: { icon: 'chart-no-axes-combined', color: '#333533' },
  'Rental Income': { icon: 'house-plus', color: '#ea3546' },
  'Rent / Mortgage': { icon: 'house', color: '#a8dadc' },
  Utilities: { icon: 'plug', color: '#e85d04' },
  'Groceries ': { icon: 'shopping-basket', color: '#e63946' },
  Celebrations: { icon: 'party-popper', color: '#ff6392' },
  Transportation: { icon: 'bus-front', color: '#ef476f' },
  'Healthcare ': { icon: 'pill', color: '#a53860' },
  'Education ': { icon: 'graduation-cap', color: '#b388eb' },
  'Loan Payments': { icon: 'landmark', color: '#e0afa0' },
  'Insurance ': { icon: 'indian-rupee', color: '#656d4a' },
  'Taxes ': { icon: 'files', color: '#457b9d' },
  'Dining Out': { icon: 'hand-platter', color: '#f7aef8' },
  'Entertainment ': { icon: 'clapperboard', color: '#d68c45' },
  'Shopping ': { icon: 'shopping-cart', color: '#1d3557' },
  'Travel ': { icon: 'earth', color: '#273469' },
  'Donations ': { icon: 'hand-coins', color: '#29bf12' },
  'Savings & Emergency Fund': { icon: 'piggy-bank', color: '#011627' },
  'Maintenance ': { icon: 'house-plug', color: '#ff9f1c' },
  'Pet Expenses': { icon: 'paw-print', color: '#bd4f6c' },
  'Books ': { icon: 'library-big', color: '#80727b' },
  'Subscriptions ': { icon: 'tv-minimal-play', color: '#63264a' },
  'Hobbies ': { icon: 'palette', color: '#89b0ae' },
  'Fitness ': { icon: 'dumbbell', color: '#7f5539' },
  'Freelance Earnings': { icon: 'square-code', color: '#9e0059' },
  Others: { icon: 'plus', color: '#4c5760' },
};
