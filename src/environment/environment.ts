export const environment = {
  production: false,
  loginUrl: 'http://localhost:3000/auth/login',
  registerUrl: 'http://localhost:3000/auth/register',
  TRANSACTION_FEATURE_KEY: 'transactions',
  transactionUrl: 'http://localhost:3000/transaction',
  currentPage: 1,
  pageSize: 5,
};

export const environmentVariables = {
  transferCurrentPage: 1,
  transferPageSize: 5,
  transferUrl: 'http://localhost:3000/transfers',
  TRANSFER_FEATURE_KEY: 'transfers',
};
