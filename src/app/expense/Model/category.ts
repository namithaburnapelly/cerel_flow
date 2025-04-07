export interface Category {
  icon: string;
  color: string;
  bg_color: string;
}

export const CATEGORY_MAP: Record<string, Category> = {
  Salary: { icon: 'wallet-minimal', color: '#1f618d', bg_color: '#d6eaf8' },
  'Business Income': {
    icon: 'handshake',
    color: '#ffb703',
    bg_color: '#fff3cd',
  },
  'Gifts & Rewards': { icon: 'gift', color: '#ff8c00', bg_color: '#ffe4b5' },
  Investments: {
    icon: 'chart-no-axes-combined',
    color: '#333533',
    bg_color: '#d6d6d6',
  },
  'Rental Income': {
    icon: 'house-plus',
    color: '#0077b6',
    bg_color: '#caf0f8',
  },
  'Rent / Mortgage': { icon: 'house', color: '#7f5539', bg_color: '#e6ccb2' },
  Utilities: { icon: 'plug', color: '#d68c45ff', bg_color: '#fae0d0' },
  Groceries: { icon: 'shopping-basket', color: '#ff7f50', bg_color: '#ffe5d9' },
  Celebrations: { icon: 'party-popper', color: '#fb6f92', bg_color: '#ffe5ec' },
  Transportation: { icon: 'bus-front', color: '#ff6b35', bg_color: '#ffe5d9' },
  Healthcare: { icon: 'pill', color: '#a53860', bg_color: '#f7c5cc' },
  Education: { icon: 'graduation-cap', color: '#7b2cbf', bg_color: '#e0c3fc' },
  'Loan Payments': { icon: 'landmark', color: '#0d47a1', bg_color: '#bbdefb' },
  Insurance: { icon: 'indian-rupee', color: '#6a994e', bg_color: '#cfe3c2' },
  Taxes: { icon: 'files', color: '#1565c0', bg_color: '#bbdefb' },
  'Dining Out': { icon: 'hand-platter', color: '#ff36ab', bg_color: '#f8e1f4' },
  Entertainment: {
    icon: 'clapperboard',
    color: '#d68c45',
    bg_color: '#fce5cd',
  },
  Shopping: { icon: 'shopping-cart', color: '#5a189a', bg_color: '#e4d9ff' },
  Travel: { icon: 'earth', color: '#2d6a4f', bg_color: '#b7e4c7' },
  Donations: { icon: 'hand-coins', color: '#0077b6', bg_color: '#caf0f8' },
  'Savings & Emergency Fund': {
    icon: 'piggy-bank',
    color: '#011627',
    bg_color: '#e5e5e5',
  },
  Maintenance: { icon: 'house-plug', color: '#ff9f1c', bg_color: '#ffeedd' },
  'Pet Expenses': { icon: 'paw-print', color: '#bd4f6c', bg_color: '#f7c5cc' },
  Books: { icon: 'library-big', color: '#50008a', bg_color: '#dcd6f7' },
  Subscriptions: {
    icon: 'tv-minimal-play',
    color: '#8f2d56',
    bg_color: '#f0d1e4',
  },
  Hobbies: { icon: 'palette', color: '#23395b', bg_color: '#d4e6f1' },
  Fitness: { icon: 'dumbbell', color: '#7f5539', bg_color: '#e8c7a0' },
  'Freelance Earnings': {
    icon: 'square-code',
    color: '#9e0059',
    bg_color: '#f3c1d1',
  },
  Others: { icon: 'plus', color: '#4c5760', bg_color: '#d6d6d6' },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_MAP);
