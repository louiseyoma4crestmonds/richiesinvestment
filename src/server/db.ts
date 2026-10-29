export interface InvestmentPlan {
  id: string;
  name: string;
  tier: string;
  category: string;
  minDeposit: number;
  maxDeposit: number;
  dailyRoiPercent: number;
  durationDays: number;
  riskLevel: 'Low' | 'Moderate' | 'Balanced' | 'High-Yield';
  capitalBack: boolean;
  status: 'active' | 'popular' | 'vip';
  description: string;
  features: string[];
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'crypto' | 'forex' | 'commodity' | 'stocks';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  sparkline: number[];
}

export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'referral' | 'transfer';
  amount: number;
  asset: string;
  txHash: string;
  status: 'completed' | 'pending' | 'rejected';
  timestamp: string;
  note?: string;
}

export interface UserInvestment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  dailyRoiPercent: number;
  dailyEarnings: number;
  totalReturnExpected: number;
  totalEarnedSoFar: number;
  startDate: string;
  endDate: string;
  daysElapsed: number;
  durationDays: number;
  status: 'active' | 'completed';
  lastClaimDate?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username?: string;
  role?: 'admin' | 'user';
  country?: string;
  phone?: string;
  balance: number;
  profit?: number;
  bonus?: number;
  totalInvested: number;
  totalEarned: number;
  totalWithdrawn: number;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number;
  referralCount: number;
  cryptoWallets: {
    btc?: string;
    eth?: string;
    usdtTrx?: string;
    usdtEth?: string;
  };
  security: {
    twoFactorEnabled: boolean;
    emailAlerts: boolean;
  };
  createdAt: string;
}

export interface AdminDepositWallet {
  id: string;
  currency: string;
  network: string;
  address: string;
  qrCodeUrl?: string;
  active: boolean;
  minDeposit: number;
}

export interface TradingPerformanceRecord {
  id: string;
  userId: string;
  asset: string;
  type: 'buy' | 'sell';
  outcome: 'win' | 'loss' | 'active';
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  profitOrLoss: number;
  percentageReturn: number;
  timestamp: string;
  status: 'closed' | 'open';
}

export interface PlatformStats {
  totalDeposited: number;
  totalWithdrawn: number;
  activeInvestors: number;
  countriesCount: number;
  runningDays: number;
  insuranceFund: number;
  lastUpdated: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  country: string;
  avatar: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
  verifiedInvestor: boolean;
  investmentTier: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  tag: 'Login' | 'Registration' | 'Deposit' | 'Withdrawal' | 'Security' | 'Transfer';
  timestamp: string;
  timeAgo: string;
  read: boolean;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

// Initial Database Seed Data
export const seedPlans: InvestmentPlan[] = [
  {
    id: 'veteran-plan',
    name: 'Veteran Plan',
    tier: 'Daily Returns',
    category: 'Daily Returns',
    minDeposit: 200,
    maxDeposit: 20000,
    dailyRoiPercent: 2.5,
    durationDays: 5,
    riskLevel: 'Balanced',
    capitalBack: true,
    status: 'active',
    description: 'Daily returns for 5 days, $200–$20,000. Optimized for consistent capital compounding.',
    features: ['Daily returns for 5 days, $200–$20,000', 'Minimum: $200', 'Maximum: $20,000', 'Duration: 5 Days', 'Referral: 5%', '24/7 Customer Support']
  },
  {
    id: 'master-plan',
    name: 'Master Plan',
    tier: 'Daily Returns',
    category: 'Daily Returns',
    minDeposit: 20000,
    maxDeposit: 100000,
    dailyRoiPercent: 3.5,
    durationDays: 10,
    riskLevel: 'Moderate',
    capitalBack: true,
    status: 'popular',
    description: 'Daily returns for 10 days, $20,000–$100,000. High-performance liquidity routing.',
    features: ['Daily returns for 10 days, $20,000–$100,000', 'Minimum: $20,000', 'Maximum: $100,000', 'Duration: 10 Days', 'Referral: 5%', '24/7 Customer Support']
  },
  {
    id: 'ultimate-plan',
    name: 'Ultimate Plan',
    tier: 'Daily Returns',
    category: 'Daily Returns',
    minDeposit: 100000,
    maxDeposit: 1000000,
    dailyRoiPercent: 5.0,
    durationDays: 20,
    riskLevel: 'High-Yield',
    capitalBack: true,
    status: 'vip',
    description: 'Daily returns for 20 days, $100,000+. Institutional grade asset deployment with unlimited upside.',
    features: ['Daily returns for 20 days, $100,000+', 'Minimum: $100,000', 'Maximum: Unlimited', 'Duration: 20 Days', 'Referral: 5%', '24/7 Customer Support']
  },
  {
    id: 'longterm-growth',
    name: 'Long-Term Growth',
    tier: 'Long-Term',
    category: 'Long-Term',
    minDeposit: 1000,
    maxDeposit: 50000,
    dailyRoiPercent: 6.5,
    durationDays: 45,
    riskLevel: 'Balanced',
    capitalBack: true,
    status: 'active',
    description: 'Targeted long-term wealth appreciation across infrastructure and physical commodities.',
    features: ['Bi-weekly compounding schedule', 'Minimum: $1,000', 'Maximum: $50,000', 'Duration: 45 Days', 'Referral: 7%', 'Dedicated Portfolio Advisor']
  },
  {
    id: 'institutional-reserve',
    name: 'Institutional Reserve',
    tier: 'Long-Term',
    category: 'Long-Term',
    minDeposit: 50000,
    maxDeposit: 500000,
    dailyRoiPercent: 8.0,
    durationDays: 60,
    riskLevel: 'High-Yield',
    capitalBack: true,
    status: 'vip',
    description: 'Prime liquidity node structured for family offices and institutional capital partners.',
    features: ['Escrow and multi-sig security', 'Minimum: $50,000', 'Maximum: $500,000', 'Duration: 60 Days', 'Referral: 10%', 'VIP Concierge Desk']
  }
];

export const seedAssets: MarketAsset[] = [
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    price: 68450.25,
    change24h: 3.42,
    high24h: 69120.00,
    low24h: 66100.50,
    volume: '$38.2B',
    sparkline: [66200, 66800, 66500, 67400, 67100, 68050, 68450]
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    price: 3520.80,
    change24h: 2.15,
    high24h: 3580.40,
    low24h: 3410.00,
    volume: '$19.4B',
    sparkline: [3420, 3450, 3410, 3480, 3500, 3510, 3520]
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    category: 'crypto',
    price: 178.60,
    change24h: 5.80,
    high24h: 182.40,
    low24h: 167.90,
    volume: '$6.8B',
    sparkline: [168, 171, 170, 174, 175, 177, 178.6]
  },
  {
    symbol: 'XRP/USD',
    name: 'Ripple',
    category: 'crypto',
    price: 0.584,
    change24h: 1.20,
    high24h: 0.596,
    low24h: 0.571,
    volume: '$2.1B',
    sparkline: [0.572, 0.575, 0.571, 0.580, 0.582, 0.583, 0.584]
  },
  {
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    price: 1.0845,
    change24h: -0.14,
    high24h: 1.0872,
    low24h: 1.0821,
    volume: '$142.5B',
    sparkline: [1.086, 1.087, 1.085, 1.083, 1.084, 1.0842, 1.0845]
  },
  {
    symbol: 'GBP/USD',
    name: 'British Pound / USD',
    category: 'forex',
    price: 1.2980,
    change24h: 0.22,
    high24h: 1.3015,
    low24h: 1.2940,
    volume: '$98.4B',
    sparkline: [1.294, 1.296, 1.295, 1.297, 1.299, 1.2975, 1.298]
  },
  {
    symbol: 'USD/JPY',
    name: 'US Dollar / Japanese Yen',
    category: 'forex',
    price: 153.40,
    change24h: 0.35,
    high24h: 153.85,
    low24h: 152.90,
    volume: '$110.1B',
    sparkline: [152.9, 153.1, 153.0, 153.3, 153.6, 153.5, 153.4]
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    category: 'commodity',
    price: 2745.50,
    change24h: 0.85,
    high24h: 2758.00,
    low24h: 2722.10,
    volume: '$54.0B',
    sparkline: [2725, 2730, 2728, 2739, 2742, 2748, 2745.5]
  },
  {
    symbol: 'BRENT/USD',
    name: 'Crude Oil Brent',
    category: 'commodity',
    price: 74.20,
    change24h: -1.10,
    high24h: 75.80,
    low24h: 73.50,
    volume: '$31.5B',
    sparkline: [75.5, 75.2, 74.8, 74.1, 73.8, 74.0, 74.2]
  },
  {
    symbol: 'SPX500',
    name: 'S&P 500 Index',
    category: 'stocks',
    price: 5860.40,
    change24h: 0.45,
    high24h: 5875.20,
    low24h: 5835.00,
    volume: '$62.8B',
    sparkline: [5838, 5845, 5840, 5852, 5858, 5864, 5860.4]
  }
];

export const seedStats: PlatformStats = {
  totalDeposited: 48924150.00,
  totalWithdrawn: 19340820.00,
  activeInvestors: 32840,
  countriesCount: 142,
  runningDays: 1480,
  insuranceFund: 5500000.00,
  lastUpdated: new Date().toISOString()
};

export const seedTransactions: Transaction[] = [
  {
    id: 'tx-101',
    userId: 'user-ext-1',
    userName: 'alex_k***',
    type: 'deposit',
    amount: 15000,
    asset: 'USDT (TRC20)',
    txHash: '0x8f2a...c4e9',
    status: 'completed',
    timestamp: '2 mins ago',
    note: 'Deposit to Silver Crypto Plan'
  },
  {
    id: 'tx-102',
    userId: 'user-ext-2',
    userName: 'elena_m***',
    type: 'withdrawal',
    amount: 3450,
    asset: 'Bitcoin (BTC)',
    txHash: '3a7b...82f1',
    status: 'completed',
    timestamp: '5 mins ago',
    note: 'Daily ROI Profit Withdrawal'
  },
  {
    id: 'tx-103',
    userId: 'user-ext-3',
    userName: 'david_r***',
    type: 'deposit',
    amount: 25000,
    asset: 'Ethereum (ETH)',
    txHash: '0x1c4d...99b2',
    status: 'completed',
    timestamp: '11 mins ago',
    note: 'Deposit to Gold Energy Plan'
  },
  {
    id: 'tx-104',
    userId: 'user-ext-4',
    userName: 'wei_chen***',
    type: 'withdrawal',
    amount: 8200,
    asset: 'USDT (ERC20)',
    txHash: '0x99e1...554a',
    status: 'completed',
    timestamp: '18 mins ago',
    note: 'Instant Liquidity Settlement'
  },
  {
    id: 'tx-105',
    userId: 'user-ext-5',
    userName: 'felipe_s***',
    type: 'deposit',
    amount: 50000,
    asset: 'Bitcoin (BTC)',
    txHash: '7c8d...00a3',
    status: 'completed',
    timestamp: '24 mins ago',
    note: 'Deposit to Platinum Real Estate'
  },
  {
    id: 'tx-106',
    userId: 'user-ext-6',
    userName: 'sophie_b***',
    type: 'withdrawal',
    amount: 1250,
    asset: 'USDT (TRC20)',
    txHash: '0x33b1...77ea',
    status: 'completed',
    timestamp: '32 mins ago',
    note: 'Affiliate Commission Payout'
  },
  {
    id: 'tx-107',
    userId: 'user-ext-7',
    userName: 'tariq_a***',
    type: 'deposit',
    amount: 100000,
    asset: 'USDT (TRC20)',
    txHash: '0x7e29...fa12',
    status: 'completed',
    timestamp: '45 mins ago',
    note: 'Deposit to Quantum VIP Pool'
  }
];

export const seedTestimonials: Testimonial[] = [
  {
    id: 'test-rohan',
    author: 'ROHAN BHATTACHARYA',
    country: 'Switzerland',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'Managing Partner, Swiss Capital',
    rating: 5,
    comment: 'Investing through this platform has simplified our portfolio management. The returns are consistent, and the team\'s insights are invaluable.',
    date: '3 days ago',
    verifiedInvestor: true,
    investmentTier: 'Master Plan'
  },
  {
    id: 'test-1',
    author: 'Maximilian Vance',
    country: 'United Kingdom',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Managing Director, Horizon Asset Fund',
    rating: 5,
    comment: 'The transparency of QUANTUM PLUS Industrial Partnership is exceptional. The daily automated profit distributions on our corporate portfolio have settled promptly without a single disruption.',
    date: '2 weeks ago',
    verifiedInvestor: true,
    investmentTier: 'Veteran Plan'
  },
  {
    id: 'test-2',
    author: 'Clara Dubois',
    country: 'France',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Private Equity Investor',
    rating: 5,
    comment: 'As someone who has managed family office wealth for a decade, finding algorithmic arbitrage that balances high yields with stringent stop-loss parameters is rare. QIP has exceeded my benchmark expectations.',
    date: '1 month ago',
    verifiedInvestor: true,
    investmentTier: 'Silver Crypto Arbitrage'
  },
  {
    id: 'test-3',
    author: 'Dr. Tariq Al-Mansoor',
    country: 'United Arab Emirates',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Infrastructure Technologist',
    rating: 5,
    comment: 'QUANTUM PLUS Industrial Partnership provides an institutional-grade platform with responsive account managers in London. The VIP node deposit and withdrawal speed is virtually instantaneous.',
    date: '3 weeks ago',
    verifiedInvestor: true,
    investmentTier: 'Quantum VIP Pool'
  },
  {
    id: 'test-4',
    author: 'Hanna Lindstrom',
    country: 'Sweden',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Financial Analyst',
    rating: 5,
    comment: 'Started with the Starter Forex package with $1,000 to test the execution speed and capital return. At maturity, both my initial principal and accumulated daily profits were withdrawn to my USDT wallet in under 10 minutes.',
    date: '5 days ago',
    verifiedInvestor: true,
    investmentTier: 'Starter Forex'
  }
];

export const seedUsers: Record<string, UserProfile> = {
  'ouimas': {
    uid: 'ouimas',
    email: 'eyomao@gmail.com',
    displayName: 'ouimas',
    username: 'ouimasbot',
    role: 'user',
    country: 'Bahamas',
    phone: '+1234567890',
    balance: 0.00,
    profit: 0.00,
    bonus: 0.00,
    totalInvested: 0.00,
    totalEarned: 0.00,
    totalWithdrawn: 0.00,
    referralCode: 'QIP-OM881',
    referredBy: 'QIP-HQ001',
    referralEarnings: 0.00,
    referralCount: 0,
    cryptoWallets: {
      btc: '',
      eth: '',
      usdtTrx: ''
    },
    security: {
      twoFactorEnabled: false,
      emailAlerts: true
    },
    createdAt: '2026-10-26T22:22:00Z'
  },
  'admin': {
    uid: 'admin',
    // email: process.env.ADMIN_EMAIL || 'admin@quantumindustrialpartnership.net',
    email: 'admin@quantumindustrialpartnership.net',
    displayName: 'QUANTUM PLUS Administrator',
    // username: process.env.ADMIN_USERNAME || 'admin',
    role: 'admin',
    country: 'United Kingdom',
    phone: '+44 20 7946 0991',
    balance: 500000.00,
    profit: 125000.00,
    bonus: 10000.00,
    totalInvested: 250000.00,
    totalEarned: 135000.00,
    totalWithdrawn: 45000.00,
    referralCode: 'QIP-ADMIN',
    referralEarnings: 15400.00,
    referralCount: 154,
    cryptoWallets: {
      btc: 'bc1qv7nwcc70zrykgnkem845u2djy68p2u6yxk02ke',
      eth: '0x52908400098527886E0F7030069857D2E4169EE8',
      usdtTrx: 'TYD5j1Xn8dK2mP9v7B4r6s8t0u1w2x3y4z'
    },
    security: {
      twoFactorEnabled: true,
      emailAlerts: true
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  'demo-investor': {
    uid: 'demo-investor',
    email: 'investor@quantumindustrial.net',
    displayName: 'James Harrison',
    balance: 14250.00,
    totalInvested: 35000.00,
    totalEarned: 11280.00,
    totalWithdrawn: 6500.00,
    referralCode: 'QIP-JH892',
    referredBy: 'QIP-HQ001',
    referralEarnings: 2850.00,
    referralCount: 7,
    cryptoWallets: {
      btc: 'bc1q9v0z4p7m63f9k2j0h1w8s4e5r3t6y8u9i0o1p2',
      eth: '0x71C...B3F48a928B319b24',
      usdtTrx: 'TYD5j1Xn8dK2mP9v7B4r6s8t0u1w2x3y4z'
    },
    security: {
      twoFactorEnabled: true,
      emailAlerts: true
    },
    createdAt: '2024-03-15T10:00:00Z'
  },
  'sarah-trader': {
    uid: 'sarah-trader',
    email: 'sarah.lin@quantumindustrial.net',
    displayName: 'Sarah Lin',
    balance: 5800.00,
    totalInvested: 12000.00,
    totalEarned: 3450.00,
    totalWithdrawn: 1200.00,
    referralCode: 'QIP-SL402',
    referredBy: 'QIP-JH892',
    referralEarnings: 650.00,
    referralCount: 3,
    cryptoWallets: {
      btc: 'bc1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h7j8k9l0',
      eth: '0x32A...F92a819b11',
      usdtTrx: 'TRX9x8w7v6u5t4s3r2q1p0o9n8m7l6k5j4'
    },
    security: {
      twoFactorEnabled: false,
      emailAlerts: true
    },
    createdAt: '2025-01-10T12:00:00Z'
  }
};

export const seedNotifications: Record<string, UserNotification[]> = {
  'ouimas': [
    {
      id: 'notif-1',
      userId: 'ouimas',
      title: 'New Login',
      message: 'New login detected from IP: 102.90.116.220 on WebKit - Edge at 2026-10-26 23:09:43',
      tag: 'Login',
      timestamp: '2026-10-26T23:09:43Z',
      timeAgo: '1 minute ago',
      read: false,
      ip: '102.90.116.220',
      userAgent: 'WebKit - Edge'
    },
    {
      id: 'notif-2',
      userId: 'ouimas',
      title: 'Welcome to QUANTUM PLUS Industrial Partnership',
      message: 'Thank you for registering. Your account has been successfully created.',
      tag: 'Registration',
      timestamp: '2026-10-26T22:22:58Z',
      timeAgo: '48 minutes ago',
      read: false
    },
    {
      id: 'notif-3',
      userId: 'ouimas',
      title: 'New Login',
      message: 'New login detected from IP: 102.90.116.220 on WebKit - Edge at 2026-10-26 22:22:58',
      tag: 'Login',
      timestamp: '2026-10-26T22:22:58Z',
      timeAgo: '48 minutes ago',
      read: false,
      ip: '102.90.116.220',
      userAgent: 'WebKit - Edge'
    },
    {
      id: 'notif-4',
      userId: 'ouimas',
      title: 'Security Verification Complete',
      message: 'Account security profile initialized and email address verified.',
      tag: 'Security',
      timestamp: '2026-10-26T22:20:00Z',
      timeAgo: '50 minutes ago',
      read: false
    }
  ],
  'demo-investor': [
    {
      id: 'notif-demo-1',
      userId: 'demo-investor',
      title: 'Daily Yield Credited',
      message: 'Contract #inv-001 has yielded $750.00 into your balance.',
      tag: 'Deposit',
      timestamp: new Date().toISOString(),
      timeAgo: '10 minutes ago',
      read: false
    },
    {
      id: 'notif-demo-2',
      userId: 'demo-investor',
      title: 'Security Notice',
      message: 'Two-factor authentication verified from London UK Escrow Gateway.',
      tag: 'Security',
      timestamp: new Date().toISOString(),
      timeAgo: '2 hours ago',
      read: true
    }
  ]
};

export const seedUserInvestments: Record<string, UserInvestment[]> = {
  'demo-investor': [
    {
      id: 'inv-001',
      userId: 'demo-investor',
      planId: 'gold-energy',
      planName: 'Gold Oil & Energy Plan',
      amount: 25000.00,
      dailyRoiPercent: 3.0,
      dailyEarnings: 750.00,
      totalReturnExpected: 47500.00,
      totalEarnedSoFar: 9750.00,
      startDate: '2024-10-12T09:00:00Z',
      endDate: '2024-11-11T09:00:00Z',
      daysElapsed: 13,
      durationDays: 30,
      status: 'active',
      lastClaimDate: '2024-10-25T09:00:00Z'
    },
    {
      id: 'inv-002',
      userId: 'demo-investor',
      planId: 'silver-crypto',
      planName: 'Silver Crypto Arbitrage',
      amount: 10000.00,
      dailyRoiPercent: 2.4,
      dailyEarnings: 240.00,
      totalReturnExpected: 15040.00,
      totalEarnedSoFar: 1530.00,
      startDate: '2024-10-19T14:30:00Z',
      endDate: '2024-11-09T14:30:00Z',
      daysElapsed: 7,
      durationDays: 21,
      status: 'active',
      lastClaimDate: '2024-10-25T14:30:00Z'
    }
  ]
};

export const seedAdminWallets: AdminDepositWallet[] = [
  {
    id: 'wallet-btc',
    currency: 'BITCOIN (BTC)',
    network: 'BTC (Bitcoin)',
    address: 'bc1qv7nwcc70zrykgnkem845u2djy68p2u6yxk02ke',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=bitcoin:bc1qv7nwcc70zrykgnkem845u2djy68p2u6yxk02ke',
    active: true,
    minDeposit: 50
  },
  {
    id: 'wallet-usdt-erc20',
    currency: 'USDT ERC20',
    network: 'Ethereum (ERC20)',
    address: '0x71C8F2d18408B319b24e69b5F191AbB47144e058',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=0x71C8F2d18408B319b24e69b5F191AbB47144e058',
    active: true,
    minDeposit: 50
  },
  {
    id: 'wallet-usdt-trc20',
    currency: 'USDT TRC20',
    network: 'Tron (TRC20)',
    address: 'TYD5j1Xn8dK2mP9v7B4r6s8t0u1w2x3y4z',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TYD5j1Xn8dK2mP9v7B4r6s8t0u1w2x3y4z',
    active: true,
    minDeposit: 50
  },
  {
    id: 'wallet-usdt-bep20',
    currency: 'USDT BEP20',
    network: 'BNB Smart Chain (BEP20)',
    address: '0x9a8B23f038d810237194f481c015b6329a1b92c1',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=0x9a8B23f038d810237194f481c015b6329a1b92c1',
    active: true,
    minDeposit: 50
  },
  {
    id: 'wallet-eth',
    currency: 'ETHEREUM (ETH)',
    network: 'Ethereum (ERC20)',
    address: '0x52908400098527886E0F7030069857D2E4169EE8',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=0x52908400098527886E0F7030069857D2E4169EE8',
    active: true,
    minDeposit: 50
  }
];

export const seedPerformanceHistory: Record<string, TradingPerformanceRecord[]> = {
  'ouimas': [],
  'demo-investor': [
    {
      id: 'trade-001',
      userId: 'demo-investor',
      asset: 'BTC/USD',
      type: 'buy',
      outcome: 'win',
      entryPrice: 65200.00,
      exitPrice: 68450.25,
      amount: 5000,
      profitOrLoss: 249.25,
      percentageReturn: 4.98,
      timestamp: '2 hours ago',
      status: 'closed'
    },
    {
      id: 'trade-002',
      userId: 'demo-investor',
      asset: 'ETH/USD',
      type: 'buy',
      outcome: 'win',
      entryPrice: 3410.00,
      exitPrice: 3520.80,
      amount: 3000,
      profitOrLoss: 97.47,
      percentageReturn: 3.25,
      timestamp: 'Yesterday',
      status: 'closed'
    },
    {
      id: 'trade-003',
      userId: 'demo-investor',
      asset: 'SOL/USD',
      type: 'sell',
      outcome: 'loss',
      entryPrice: 182.00,
      exitPrice: 184.20,
      amount: 1500,
      profitOrLoss: -18.13,
      percentageReturn: -1.21,
      timestamp: '3 days ago',
      status: 'closed'
    },
    {
      id: 'trade-004',
      userId: 'demo-investor',
      asset: 'XAU/USD (Gold)',
      type: 'buy',
      outcome: 'active',
      entryPrice: 2715.50,
      amount: 10000,
      profitOrLoss: 145.00,
      percentageReturn: 1.45,
      timestamp: 'Active Now',
      status: 'open'
    }
  ]
};

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'admin' | 'bot';
  senderName: string;
  text: string;
  timestamp: string;
  timeAgo: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export const seedChatConversations: ChatConversation[] = [
  {
    id: 'conv-ouimas',
    userId: 'ouimas',
    userName: 'ouimas',
    userEmail: 'ouimasglobal@gmail.com',
    lastMessage: 'Hello desk, what is the current network confirmation time for USDT TRC20 deposits?',
    lastUpdated: '5 minutes ago',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-ouimas',
        sender: 'user',
        senderName: 'ouimas',
        text: 'Hello desk, what is the current network confirmation time for USDT TRC20 deposits?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        timeAgo: '5 minutes ago',
        read: false
      }
    ]
  },
  {
    id: 'conv-demo-investor',
    userId: 'demo-investor',
    userName: 'James Harrison',
    userEmail: 'james.harrison@quantumindustrial.net',
    lastMessage: 'Thank you for approving the institutional balance upgrade.',
    lastUpdated: '1 hour ago',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-2',
        conversationId: 'conv-demo-investor',
        sender: 'user',
        senderName: 'James Harrison',
        text: 'Could you please confirm the next dividend settlement schedule?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        timeAgo: '1 hour ago',
        read: true
      },
      {
        id: 'msg-3',
        conversationId: 'conv-demo-investor',
        sender: 'admin',
        senderName: 'QUANTUM PLUS Admin Desk',
        text: 'Dividends settle daily at 00:00 UTC and 12:00 UTC directly to your active cash balance.',
        timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
        timeAgo: '1 hour ago',
        read: true
      },
      {
        id: 'msg-4',
        conversationId: 'conv-demo-investor',
        sender: 'user',
        senderName: 'James Harrison',
        text: 'Thank you for approving the institutional balance upgrade.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        timeAgo: '1 hour ago',
        read: true
      }
    ]
  }
];


