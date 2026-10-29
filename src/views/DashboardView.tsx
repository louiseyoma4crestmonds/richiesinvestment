import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Wallet,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  DollarSign,
  Gift,
  Search,
  Check,
  CheckCheck,
  Trash2,
  Eye,
  Info,
  Clock,
  Shield,
  KeyRound,
  Lock,
  Copy,
  Download,
  RefreshCw,
  QrCode,
  Zap,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  ArrowLeftRight,
  Send,
  ArrowLeft,
  Building,
  Home,
  PieChart,
  Activity,
  Sparkles,
  Globe,
  Phone,
  Mail,
  MapPin,
  UploadCloud,
  FileCheck,
  Layers,
  Award,
  Landmark,
  HelpCircle,
  Share2,
  Users,
  ShieldAlert
} from 'lucide-react';
import {
  UserProfile,
  UserInvestment,
  Transaction,
  InvestmentPlan,
  UserNotification,
  AdminDepositWallet,
  TradingPerformanceRecord
} from '../server/db.ts';
import { apiClient } from '../services/apiClient.ts';
import { AdminConsole } from '../components/AdminConsole.tsx';

interface DashboardViewProps {
  user: UserProfile;
  investments: UserInvestment[];
  transactions: Transaction[];
  plans: InvestmentPlan[];
  onOpenDeposit: () => void;
  onOpenInvest: () => void;
  onOpenWithdraw: () => void;
  onClaimProfit: (investmentId: string) => void;
  onRefreshUserData: () => void;
  onUpdateWallets: (wallets: Record<string, string>) => void;
  setCurrentView?: (view: string) => void;
  onLogout?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  investments,
  transactions,
  plans,
  onOpenDeposit,
  onOpenInvest,
  onOpenWithdraw,
  onClaimProfit,
  onRefreshUserData,
  onUpdateWallets,
  setCurrentView,
  onLogout
}) => {
  // Theme state: dark mode toggle matching darkmode_8bb6d740.png vs dashboard1_f430b3bc.png
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'statement'
    | 'all-plans'
    | 'real-estate'
    | 'my-portfolio'
    | 'performance-history'
    | 'deposit'
    | 'withdraw'
    | 'transfer'
    | 'wallet'
    | 'profile-settings'
    | 'referrals'
    | 'support'
    | 'notifications'
    | 'security'
    | 'admin'
  >('dashboard');

  // Sidebar Submenus
  const [investmentsOpen, setInvestmentsOpen] = useState(true);
  const [walletOpen, setWalletOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);

  // Top Bar Dropdowns
  const [quickTradeOpen, setQuickTradeOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: 'notif-1',
      userId: user.uid,
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
      userId: user.uid,
      title: 'Welcome to QUANTUM PLUS Industrial Partnership',
      message: 'Thank you for registering. Your account has been successfully created.',
      tag: 'Registration',
      timestamp: '2026-10-26T22:22:58Z',
      timeAgo: '48 minutes ago',
      read: false
    },
    {
      id: 'notif-3',
      userId: user.uid,
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
      userId: user.uid,
      title: 'Security Verification Complete',
      message: 'Account security profile initialized and email address verified.',
      tag: 'Security',
      timestamp: '2026-10-26T22:20:00Z',
      timeAgo: '50 minutes ago',
      read: false
    }
  ]);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifSearch, setNotifSearch] = useState('');
  const [selectedNotifModal, setSelectedNotifModal] = useState<UserNotification | null>(null);

  // Internal Transfer State (matching transfer.png)
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStatus, setTransferStatus] = useState<{
    type: 'error' | 'success';
    message: string;
    txId?: string;
  } | null>(null);

  // Referral State
  const [copiedLink, setCopiedLink] = useState(false);

  // Profile Settings State (matching profile2_9f942038.png to profile-security2_11fe3c5e.png)
  const [profileTab, setProfileTab] = useState<'personal' | 'security'>('personal');
  const [editFullName, setEditFullName] = useState(user.displayName || 'ouimas');
  const [editPhone, setEditPhone] = useState(user.phone || '+1 242 555 0192');
  const [editCountry, setEditCountry] = useState(user.country || 'Bahamas');
  const [editUsername, setEditUsername] = useState(user.username || 'ouimasbot');
  const [profileUpdateStatus, setProfileUpdateStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Reset in Dashboard State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Wallets form state
  const [btcWallet, setBtcWallet] = useState(user.cryptoWallets?.btc || '');
  const [ethWallet, setEthWallet] = useState(user.cryptoWallets?.eth || '');
  const [usdtWallet, setUsdtWallet] = useState(user.cryptoWallets?.usdtTrx || '');
  const [walletSavedToast, setWalletSavedToast] = useState(false);

  // Deposit Multi-step State (matching pay1_1664c794.png to pay4_1d0c232b.png)
  const [depositStep, setDepositStep] = useState<1 | 2 | 3>(1);
  const [depositAmount, setDepositAmount] = useState('500');
  const [depositCurrency, setDepositCurrency] = useState('BTC');
  const [depositTxHash, setDepositTxHash] = useState('');
  const [depositProofFileName, setDepositProofFileName] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);
  const [depositSuccessResult, setDepositSuccessResult] = useState<{ txId: string; amount: number; asset: string } | null>(null);
  const [depositWallets, setDepositWallets] = useState<AdminDepositWallet[]>([]);
  const [copiedDepositAddress, setCopiedDepositAddress] = useState(false);

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAsset, setWithdrawAsset] = useState('USDT TRC20');
  const [withdrawDestination, setWithdrawDestination] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Investment Plans Calculator State (matching allplans1_3854d2b1.png & allplans2_f62fea42.png)
  const [planAmounts, setPlanAmounts] = useState<{ [planId: string]: number }>({
    'plan-veteran': 200,
    'plan-master': 20000,
    'plan-ultimate': 100000,
    're-residential': 500,
    're-commercial': 5000,
    're-luxury': 25000
  });
  const [investActionMessage, setInvestActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isInvesting, setIsInvesting] = useState(false);

  // Performance History State (matching pef1_6ff05794.png)
  const [performanceRecords, setPerformanceRecords] = useState<TradingPerformanceRecord[]>([]);
  const [perfStats, setPerfStats] = useState({ total: 1428, wins: 1276, losses: 152, active: 18, winRate: 89.4 });
  const [perfFilter, setPerfFilter] = useState<'all' | 'win' | 'loss' | 'buy' | 'sell'>('all');
  const [perfLoading, setPerfLoading] = useState(false);

  // Load public deposit wallets & performance history on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const wallets = await apiClient.getPublicDepositWallets();
        if (wallets && wallets.length > 0) {
          setDepositWallets(wallets);
        }
      } catch (err) {
        // default fallback
      }

      try {
        setPerfLoading(true);
        const perf = await apiClient.getPerformance();
        if (perf) {
          if (perf.records) setPerformanceRecords(perf.records);
          if (perf.stats) setPerfStats(perf.stats);
        }
      } catch (err) {
        // fallback
      } finally {
        setPerfLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Fetch live notifications on mount and when user changes
  useEffect(() => {
    async function loadNotifications() {
      try {
        const notifs = await apiClient.getNotifications(user.uid);
        if (notifs && notifs.length > 0) {
          setNotifications(notifs);
        }
      } catch (err) {
        // fallback to initial list
      }
    }
    loadNotifications();
  }, [user.uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const referralUrl = `https://quantumindustrialpartnership.net/ref?u=${user.displayName || user.uid}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleMarkRead = async (notifId: string) => {
    try {
      await apiClient.markNotificationRead({ uid: user.uid, notifId });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markNotificationRead({ uid: user.uid, markAll: true });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleDeleteNotif = async (notifId: string) => {
    try {
      await apiClient.deleteNotification({ uid: user.uid, notifId });
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch (err) {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await apiClient.changePassword({
        uid: user.uid,
        currentPassword,
        newPassword
      });

      if (res.success) {
        setPasswordStatus({ type: 'success', text: 'Password successfully updated!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', text: res.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', text: 'Network error updating password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateStatus(null);
    setIsSavingProfile(true);
    try {
      const res = await apiClient.updateProfileDetails({
        uid: user.uid,
        displayName: editFullName,
        phone: editPhone,
        country: editCountry,
        username: editUsername
      });
      if (res.success) {
        setProfileUpdateStatus({ type: 'success', text: 'Profile information updated successfully!' });
        onRefreshUserData();
      } else {
        setProfileUpdateStatus({ type: 'error', text: res.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setProfileUpdateStatus({ type: 'error', text: 'Network error saving profile changes.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleInternalTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferStatus(null);

    const amountNum = parseFloat(transferAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferStatus({ type: 'error', message: 'Please enter a valid transfer amount.' });
      return;
    }

    if (amountNum < 50) {
      setTransferStatus({ type: 'error', message: 'Minimum transfer amount is $50.00.' });
      return;
    }

    if (amountNum > user.balance) {
      setTransferStatus({
        type: 'error',
        message: `Insufficient balance. Available: $${user.balance.toFixed(2)}`
      });
      return;
    }

    if (!transferRecipient.trim()) {
      setTransferStatus({ type: 'error', message: 'Please specify the recipient account username or email.' });
      return;
    }

    setIsTransferring(true);
    try {
      const res = await apiClient.transfer({
        uid: user.uid,
        recipientIdentifier: transferRecipient.trim(),
        amount: amountNum
      });

      if (res.success) {
        setTransferStatus({
          type: 'success',
          message: res.message || `Transfer of $${amountNum.toFixed(2)} to ${transferRecipient} completed successfully!`,
          txId: res.transaction?.id
        });
        setTransferRecipient('');
        setTransferAmount('');
        onRefreshUserData();

        setNotifications((prev) => [
          {
            id: 'notif-trf-' + Date.now(),
            userId: user.uid,
            title: 'Transfer Completed',
            message: `Successfully transferred $${amountNum.toFixed(2)} to ${transferRecipient}. Transfer fee: 0%.`,
            tag: 'Transfer',
            timestamp: new Date().toISOString(),
            timeAgo: 'Just now',
            read: false
          },
          ...prev
        ]);
      } else {
        setTransferStatus({
          type: 'error',
          message: res.error || 'Failed to complete internal transfer. Please check recipient details and try again.'
        });
      }
    } catch (err: any) {
      setTransferStatus({
        type: 'error',
        message: 'Network error processing transfer: ' + (err?.message || 'Server unavailable')
      });
    } finally {
      setIsTransferring(false);
    }
  };

  const handleSaveWallets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWallets({
      btc: btcWallet,
      eth: ethWallet,
      usdtTrx: usdtWallet
    });
    setWalletSavedToast(true);
    setTimeout(() => setWalletSavedToast(false), 2500);
  };

  // Join Plan directly from All Plans / Real Estate
  const handleJoinPlan = async (planId: string, planName: string, minAmount: number, maxAmount: number) => {
    setInvestActionMessage(null);
    const amount = planAmounts[planId] || minAmount;
    if (amount < minAmount) {
      setInvestActionMessage({ type: 'error', text: `Minimum investment for ${planName} is $${minAmount.toLocaleString()}.` });
      return;
    }
    if (amount > maxAmount) {
      setInvestActionMessage({ type: 'error', text: `Maximum investment for ${planName} is $${maxAmount.toLocaleString()}.` });
      return;
    }
    if (amount > user.balance) {
      setInvestActionMessage({
        type: 'error',
        text: `Insufficient account balance ($${user.balance.toFixed(2)}). Please deposit funds to invest.`
      });
      return;
    }

    setIsInvesting(true);
    try {
      const res = await apiClient.invest({
        uid: user.uid,
        planId,
        amount
      });
      if (res.success) {
        setInvestActionMessage({
          type: 'success',
          text: `Successfully joined ${planName} with $${amount.toLocaleString()}! Contract is now active.`
        });
        onRefreshUserData();
        // Refresh performance table as well
        const perf = await apiClient.getPerformance();
        if (perf && perf.records) setPerformanceRecords(perf.records);
      } else {
        setInvestActionMessage({ type: 'error', text: res.error || 'Failed to initialize investment contract.' });
      }
    } catch (err: any) {
      setInvestActionMessage({ type: 'error', text: 'Network error joining investment plan.' });
    } finally {
      setIsInvesting(false);
    }
  };

  // Deposit Workflow Handlers
  const currentSelectedWallet = depositWallets.find(
    (w) => w.currency.toLowerCase().includes(depositCurrency.toLowerCase()) || depositCurrency.toLowerCase().includes(w.currency.toLowerCase())
  ) || {
    id: 'default-btc',
    currency: 'Bitcoin (BTC)',
    network: 'Bitcoin Mainnet',
    address: 'bc1qv7nwcc70zrykgnkem845u2djy68p2u6yxk02ke',
    isActive: true
  };

  const handleCopyDepositAddress = () => {
    navigator.clipboard.writeText(currentSelectedWallet.address);
    setCopiedDepositAddress(true);
    setTimeout(() => setCopiedDepositAddress(false), 2500);
  };

  const handleSubmitDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(depositAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid deposit amount.');
      return;
    }

    setIsSubmittingDeposit(true);
    try {
      const res = await apiClient.deposit({
        uid: user.uid,
        amount: amountNum,
        asset: depositCurrency,
        txHash: depositTxHash.trim() || undefined
      });

      if (res.success) {
        setDepositSuccessResult({
          txId: res.transaction?.id || 'TX-' + Math.floor(100000 + Math.random() * 900000),
          amount: amountNum,
          asset: depositCurrency
        });
        setDepositStep(3);
        onRefreshUserData();
      } else {
        alert(res.error || 'Deposit submission failed.');
      }
    } catch (err) {
      alert('Network error submitting deposit.');
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  // Withdraw Submit
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStatus(null);
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setWithdrawStatus({ type: 'error', text: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (amountNum < 20) {
      setWithdrawStatus({ type: 'error', text: 'Minimum withdrawal amount is $20.00.' });
      return;
    }
    if (amountNum > user.balance) {
      setWithdrawStatus({ type: 'error', text: `Insufficient balance. Available: $${user.balance.toFixed(2)}` });
      return;
    }
    if (!withdrawDestination.trim()) {
      setWithdrawStatus({ type: 'error', text: 'Please provide a valid destination payout wallet address.' });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await apiClient.withdraw({
        uid: user.uid,
        amount: amountNum,
        asset: withdrawAsset,
        destinationAddress: withdrawDestination.trim()
      });
      if (res.success) {
        setWithdrawStatus({
          type: 'success',
          text: `Withdrawal request for $${amountNum.toFixed(2)} submitted successfully! Processing time: 10-30 mins.`
        });
        setWithdrawAmount('');
        setWithdrawDestination('');
        onRefreshUserData();
      } else {
        setWithdrawStatus({ type: 'error', text: res.error || 'Withdrawal failed.' });
      }
    } catch (err) {
      setWithdrawStatus({ type: 'error', text: 'Network error processing withdrawal request.' });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const exportStatementCsv = () => {
    const headers = ['ID', 'Type', 'Amount', 'Asset', 'Status', 'Timestamp', 'TxHash'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.asset,
      t.status,
      t.timestamp,
      t.txHash
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `statement-${user.uid}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'unread' && n.read) return false;
    if (notifFilter === 'read' && !n.read) return false;
    if (notifSearch.trim()) {
      const q = notifSearch.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Performance History
  const filteredPerformanceRecords = performanceRecords.filter((r) => {
    if (perfFilter === 'win') return r.outcome === 'win';
    if (perfFilter === 'loss') return r.outcome === 'loss';
    if (perfFilter === 'buy') return r.type === 'buy';
    if (perfFilter === 'sell') return r.type === 'sell';
    return true;
  });

  // Calculate stats
  const activeContractsCount = investments.filter((i) => i.status === 'active').length;
  const totalEarnedYield = (user.profit || 0) + investments.reduce((acc, i) => acc + (i.totalEarnedSoFar || 0), 0) + (user.totalEarned || 0);
  const totalInvestedSum = investments.reduce((acc, i) => acc + (i.amount || 0), 0) + (user.totalInvested || 0);

  // CSS classes dynamic by theme
  const bgMain = isDarkMode ? 'bg-[#0a0d14] text-slate-100' : 'bg-[#f8fafc] text-slate-900';
  const bgHeader = isDarkMode ? 'bg-[#0a0d14] border-b border-[#1f2737]' : 'bg-white border-b border-slate-200';
  const bgSidebar = isDarkMode ? 'bg-[#0a0d14] border-r border-[#1f2737]' : 'bg-white border-r border-slate-200';
  const bgCard = isDarkMode ? 'bg-[#121723] border border-[#1e2638]' : 'bg-white border border-slate-200';
  const bgCardSub = isDarkMode ? 'bg-[#161c28]' : 'bg-slate-50';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const textHeading = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white ${bgMain}`}>
      {/* 1. TOP NAVIGATION BAR (MATCHING SCREENSHOTS) */}
      <header className={`sticky top-0 z-40 h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between ${bgHeader}`}>
        {/* Left: Quantum Branding */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <svg viewBox="0 0 100 100" className="w-8 h-8">
            <defs>
              <linearGradient id="qGradDash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7a7082" />
                <stop offset="100%" stopColor="#431c53" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="60" height="60" rx="14" fill="none" stroke="url(#qGradDash)" strokeWidth="12" />
            <path d="M55 55 L82 82" stroke="url(#qGradDash)" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col">
            <span className={`font-extrabold tracking-wider text-base leading-none ${isDarkMode ? 'text-white' : 'text-[#3a204d]'}`}>
              QUANTUM PLUS
            </span>
            <span className="text-[7px] font-semibold tracking-[0.2em] text-slate-400 uppercase leading-tight mt-0.5">
              INDUSTRIAL PARTNERSHIP
            </span>
          </div>
        </div>

        {/* Center: Account Balance Container Box (exact match to screenshot) */}
        <div className={`hidden md:flex flex-col items-start px-4 py-1.5 rounded-xl border ${
          isDarkMode
            ? 'bg-[#161c28] border-slate-700/60'
            : 'bg-[#f1f5f9] border-slate-200'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            ACCOUNT BALANCE
          </span>
          <span className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Right Section: Quick Trade, Bell, Theme Toggle, User Avatar */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* Quick Trade Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuickTradeOpen(!quickTradeOpen)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
              <span>Quick Trade</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {quickTradeOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1.5 z-50 text-xs border ${
                  isDarkMode ? 'bg-[#161c28] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <button
                  onClick={() => {
                    setQuickTradeOpen(false);
                    setActiveTab('deposit');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-600/10 hover:text-blue-500 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">Deposit Funds</span>
                </button>
                <button
                  onClick={() => {
                    setQuickTradeOpen(false);
                    setActiveTab('withdraw');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-600/10 hover:text-blue-500 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <MinusCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium">Withdraw</span>
                </button>
                <button
                  onClick={() => {
                    setQuickTradeOpen(false);
                    setActiveTab('all-plans');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-600/10 hover:text-blue-500 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="font-medium">Invest in Plans</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell with Badge */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-white transition cursor-pointer"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-[#0a0d14]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Switcher (exact toggle from screenshots) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Avatar & Dropdown Pill (exact match to screenshot profile1_4df68bec.png) */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                {(user.displayName || user.uid).charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {user.displayName || user.uid}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Trading Account</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
            </button>

            {/* Profile Dropdown Menu Matching profile1_4df68bec.png */}
            {userDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-2 z-50 text-xs border ${
                  isDarkMode ? 'bg-[#161c28] border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="px-3.5 py-2.5 border-b border-slate-700/40 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {(user.displayName || user.uid).charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate">{user.displayName || user.uid}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile-settings');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-600/10 flex items-center gap-2.5 transition"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('statement');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-600/10 flex items-center gap-2.5 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Account History</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('support');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 hover:bg-blue-600/10 flex items-center gap-2.5 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Support Center</span>
                </button>

                {/* Admin Console entry - strictly visible to admin only */}
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-amber-600/10 text-amber-400 font-bold flex items-center justify-between transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>Admin Console</span>
                    </div>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      ROOT
                    </span>
                  </button>
                )}

                <div className="border-t border-slate-700/40 my-1"></div>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    if (onLogout) onLogout();
                    else if (setCurrentView) setCurrentView('login');
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: SIDEBAR + MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT SIDEBAR (EXACT MATCH TO SCREENSHOTS) */}
        <aside className={`w-full md:w-64 shrink-0 p-4 sm:p-5 flex flex-col justify-between ${bgSidebar}`}>
          <div className="space-y-1.5">
            {/* Top green dot indicator matching screenshot */}
            <div className="pl-3 pb-3 hidden md:block">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block shadow-xs shadow-emerald-500/50"></span>
            </div>

            {/* Dashboard Link */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? isDarkMode
                    ? 'bg-[#182030] text-blue-400 font-bold border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 font-bold'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Account Statement */}
            <button
              onClick={() => setActiveTab('statement')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeTab === 'statement'
                  ? isDarkMode
                    ? 'bg-[#182030] text-blue-400 font-bold border border-blue-500/30'
                    : 'bg-blue-50 text-blue-600 font-bold'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>Account Statement</span>
              </div>
              {activeTab === 'statement' && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Investments Menu with Sub-items matching allplans1_3854d2b1.png */}
            <div>
              <button
                onClick={() => setInvestmentsOpen(!investmentsOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'all-plans' || activeTab === 'real-estate' || activeTab === 'my-portfolio' || activeTab === 'performance-history'
                    ? isDarkMode
                      ? 'bg-[#182030] text-blue-400 font-bold border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Investments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(activeTab === 'all-plans' || activeTab === 'real-estate' || activeTab === 'my-portfolio' || activeTab === 'performance-history') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      investmentsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {investmentsOpen && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 text-xs">
                  {/* All Plans */}
                  <button
                    onClick={() => setActiveTab('all-plans')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'all-plans'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      <span>All Plans</span>
                    </div>
                    {activeTab === 'all-plans' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Real Estate */}
                  <button
                    onClick={() => setActiveTab('real-estate')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'real-estate'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5" />
                      <span>Real Estate</span>
                    </div>
                    {activeTab === 'real-estate' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* My Portfolio */}
                  <button
                    onClick={() => setActiveTab('my-portfolio')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'my-portfolio'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PieChart className="w-3.5 h-3.5" />
                      <span>My Portfolio</span>
                    </div>
                    {activeTab === 'my-portfolio' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Performance History */}
                  <button
                    onClick={() => setActiveTab('performance-history')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'performance-history'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Performance History</span>
                    </div>
                    {activeTab === 'performance-history' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Wallet & Finance Menu with Dropdown (matching transfer.png) */}
            <div>
              <button
                onClick={() => setWalletOpen(!walletOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'wallet' || activeTab === 'transfer' || activeTab === 'deposit' || activeTab === 'withdraw'
                    ? isDarkMode
                      ? 'bg-[#182030] text-blue-400 font-bold border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet & Finance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(activeTab === 'wallet' || activeTab === 'transfer' || activeTab === 'deposit' || activeTab === 'withdraw') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      walletOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {walletOpen && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 text-xs">
                  {/* Deposit Funds */}
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'deposit'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Deposit Funds</span>
                    </div>
                    {activeTab === 'deposit' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Withdraw Funds */}
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'withdraw'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MinusCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>Withdraw Funds</span>
                    </div>
                    {activeTab === 'withdraw' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Internal Transfer (exact active match from transfer.png) */}
                  <button
                    onClick={() => setActiveTab('transfer')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'transfer'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold shadow-xs'
                          : 'bg-blue-100/80 text-blue-700 font-bold shadow-xs'
                        : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
                      <span>Internal Transfer</span>
                    </div>
                    {activeTab === 'transfer' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>

                  {/* Saved Wallets */}
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'wallet'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Saved Wallets</span>
                    </div>
                    {activeTab === 'wallet' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Account Menu with Dropdown */}
            <div>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'profile-settings' || activeTab === 'referrals' || activeTab === 'support' || activeTab === 'security'
                    ? isDarkMode
                      ? 'bg-[#182030] text-blue-400 font-bold border border-blue-500/30'
                      : 'bg-blue-50 text-blue-600 font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                    accountOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="pl-4 pr-1 py-1.5 space-y-1 text-xs">
                  {/* Profile Settings */}
                  <button
                    onClick={() => setActiveTab('profile-settings')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'profile-settings'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Profile Settings</span>
                    </div>
                    {activeTab === 'profile-settings' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Referral Program */}
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'referrals'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Referral Program</span>
                    </div>
                    {activeTab === 'referrals' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>

                  {/* Support Center */}
                  <button
                    onClick={() => setActiveTab('support')}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'support'
                        ? isDarkMode
                          ? 'bg-[#1e293b] text-blue-400 font-bold'
                          : 'bg-blue-100/80 text-blue-700 font-bold'
                        : isDarkMode
                        ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Support Center</span>
                    </div>
                    {activeTab === 'support' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN CONSOLE BUTTON - strictly visible to admin only */}
            {user.role === 'admin' && (
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    activeTab === 'admin'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'text-amber-400 hover:bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Admin Console</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-amber-500/20 text-amber-300">
                    ROOT
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom: Sign Out Action */}
          <div className="pt-6 border-t border-slate-700/30 mt-6">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else if (setCurrentView) setCurrentView('login');
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* TAB 1: MAIN DASHBOARD OVERVIEW (EXACT MATCH TO dashboard1_f430b3bc.png & dashboard2_70d5908e.png) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header: Welcome, ouimas! + Invest Now Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                    Welcome, {user.displayName || user.uid}!
                  </h1>
                  <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                    Your investment dashboard overview
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('all-plans')}
                  className="px-5 py-2.5 rounded-xl bg-[#0070f3] hover:bg-[#005cd2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Invest Now</span>
                </button>
              </div>

              {/* Top Row Grid: Big Account Balance Card (Left) + 4 Stat Cards (Right 2x2) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Big Account Balance Card */}
                <div className={`lg:col-span-6 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs ${bgCard}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <CreditCard className="w-4 h-4" />
                      <span className={textHeading}>Account Balance</span>
                    </div>
                    <p className={`text-xs ${textMuted}`}>Your available funds</p>

                    <div className="pt-1">
                      <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${textHeading}`}>
                        ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                        <span>Available for Withdrawal</span>
                      </span>
                    </div>

                    <p className={`text-[11px] pt-1 ${textMuted}`}>
                      Last updated: Oct 26, 2026 10:22 PM
                    </p>
                  </div>

                  {/* Deposit and Withdraw Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-6 mt-4 border-t border-slate-700/20">
                    <button
                      onClick={() => setActiveTab('deposit')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        isDarkMode
                          ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-blue-500" />
                      <span>Deposit</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('withdraw')}
                      className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        isDarkMode
                          ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-blue-500" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>

                {/* Right: 4 Stat Cards (2x2 Grid) */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Total Profit */}
                  <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xs ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <span className={`text-xs font-semibold ${textMuted}`}>Total Profit</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="my-2">
                      <div className={`text-2xl font-bold ${textHeading}`}>
                        ${totalEarnedYield.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${textMuted}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Last period</span>
                    </div>
                  </div>

                  {/* Total Deposit */}
                  <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xs ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <span className={`text-xs font-semibold ${textMuted}`}>Total Deposit</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ArrowDownRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="my-2">
                      <div className={`text-2xl font-bold ${textHeading}`}>
                        ${totalInvestedSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${textMuted}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>All time</span>
                    </div>
                  </div>

                  {/* Total Withdrawal */}
                  <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xs ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <span className={`text-xs font-semibold ${textMuted}`}>Total Withdrawal</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="my-2">
                      <div className={`text-2xl font-bold ${textHeading}`}>
                        ${user.totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${textMuted}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>All time</span>
                    </div>
                  </div>

                  {/* Bonus */}
                  <div className={`rounded-2xl p-5 flex flex-col justify-between shadow-xs ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <span className={`text-xs font-semibold ${textMuted}`}>Bonus</span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Gift className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="my-2">
                      <div className={`text-2xl font-bold ${textHeading}`}>
                        ${(user.bonus || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] ${textMuted}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>All time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referrals Banner matching dashboard1.png */}
              <div className={`rounded-2xl p-6 sm:p-7 shadow-xs space-y-3 ${bgCard}`}>
                <h3 className={`text-base font-bold ${textHeading}`}>Referrals</h3>
                <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${textMuted}`}>
                  Present our project to your network and enjoy financial benefits. You don't need
                  an active deposit to earn affiliate commissions.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('referrals')}
                    className="px-5 py-2.5 rounded-xl bg-[#0070f3] hover:bg-[#005cd2] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ALL PLANS (EXACT MATCH TO allplans1_3854d2b1.png & allplans2_f62fea42.png) */}
          {activeTab === 'all-plans' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Breadcrumb & Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="cursor-pointer hover:text-blue-400" onClick={() => setActiveTab('dashboard')}>
                    Home
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-500 font-semibold">Investment Plans</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                      Investment Plans
                    </h1>
                    <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                      Upgrade your account with our high-yield investment opportunities
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('my-portfolio')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center gap-2 border border-blue-500/30 transition cursor-pointer self-start sm:self-auto"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Grow Your Portfolio</span>
                  </button>
                </div>
              </div>

              {investActionMessage && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    investActionMessage.type === 'error'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {investActionMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{investActionMessage.text}</span>
                </div>
              )}

              {/* 3 Main Plans Cards Grid (Veteran, Master, Ultimate) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Veteran Plan */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border relative ${bgCard}`}>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${textHeading}`}>Veteran Plan</h3>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>2.5% ROI</span>
                      </span>
                    </div>

                    <div>
                      <div className={`text-3xl font-extrabold text-blue-500`}>$200</div>
                      <span className="text-xs text-slate-400">minimum</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Min Investment: <strong className="text-white">$200</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Max Investment: <strong className="text-white">$20,000</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Return Rate: <strong className="text-emerald-400">2.5% Daily</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Duration: <strong className="text-white">5 Days</strong></span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={200}
                        max={20000}
                        value={planAmounts['plan-veteran'] || 200}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 'plan-veteran': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Daily Profit:</span>
                          <span className="text-emerald-400 font-bold">
                            +${((planAmounts['plan-veteran'] || 200) * 0.025).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total 5-Day Net Return:</span>
                          <span className="text-cyan-400 font-bold">
                            ${((planAmounts['plan-veteran'] || 200) * (1 + 0.025 * 5)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('plan-veteran', 'Veteran Plan', 200, 20000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      Join Investment Plan
                    </button>
                  </div>
                </div>

                {/* 2. Master Plan */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border relative ${bgCard}`}>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${textHeading}`}>Master Plan</h3>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>3.5% ROI</span>
                      </span>
                    </div>

                    <div>
                      <div className={`text-3xl font-extrabold text-blue-500`}>$20,000</div>
                      <span className="text-xs text-slate-400">minimum</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Min Investment: <strong className="text-white">$20,000</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Max Investment: <strong className="text-white">$100,000</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Return Rate: <strong className="text-emerald-400">3.5% Daily</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Duration: <strong className="text-white">10 Days</strong></span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={20000}
                        max={100000}
                        value={planAmounts['plan-master'] || 20000}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 'plan-master': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Daily Profit:</span>
                          <span className="text-emerald-400 font-bold">
                            +${((planAmounts['plan-master'] || 20000) * 0.035).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total 10-Day Net Return:</span>
                          <span className="text-cyan-400 font-bold">
                            ${((planAmounts['plan-master'] || 20000) * (1 + 0.035 * 10)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('plan-master', 'Master Plan', 20000, 100000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      Join Investment Plan
                    </button>
                  </div>
                </div>

                {/* 3. Ultimate Plan */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border relative ${bgCard}`}>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${textHeading}`}>Ultimate Plan</h3>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>5% ROI</span>
                      </span>
                    </div>

                    <div>
                      <div className={`text-3xl font-extrabold text-blue-500`}>$100,000</div>
                      <span className="text-xs text-slate-400">minimum</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Min Investment: <strong className="text-white">$100,000</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Max Investment: <strong className="text-white">$100,000,000</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Return Rate: <strong className="text-emerald-400">5% Daily</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>Duration: <strong className="text-white">20 Days</strong></span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={100000}
                        max={100000000}
                        value={planAmounts['plan-ultimate'] || 100000}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 'plan-ultimate': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/30 text-[11px] space-y-1">
                        <div className="flex justify-between text-slate-400">
                          <span>Daily Profit:</span>
                          <span className="text-emerald-400 font-bold">
                            +${((planAmounts['plan-ultimate'] || 100000) * 0.05).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Total 20-Day Net Return:</span>
                          <span className="text-cyan-400 font-bold">
                            ${((planAmounts['plan-ultimate'] || 100000) * (1 + 0.05 * 20)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('plan-ultimate', 'Ultimate Plan', 100000, 100000000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      Join Investment Plan
                    </button>
                  </div>
                </div>
              </div>

              {/* 3-Step Investment Guide matching allplans2_f62fea42.png */}
              <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border ${bgCard}`}>
                <h3 className={`text-lg font-bold text-center mb-8 ${textHeading}`}>
                  How to Start Investing in 3 Simple Steps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 mx-auto flex items-center justify-center font-extrabold text-base border border-blue-500/20">
                      1
                    </div>
                    <h4 className={`font-bold text-sm ${textHeading}`}>Select Plan</h4>
                    <p className={`text-xs ${textMuted}`}>
                      Choose the investment package that matches your financial goals and timeline.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-400 mx-auto flex items-center justify-center font-extrabold text-base border border-emerald-500/20">
                      2
                    </div>
                    <h4 className={`font-bold text-sm ${textHeading}`}>Enter Amount</h4>
                    <p className={`text-xs ${textMuted}`}>
                      Input your chosen investment capital within the tier limits and click join.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 text-cyan-400 mx-auto flex items-center justify-center font-extrabold text-base border border-cyan-500/20">
                      3
                    </div>
                    <h4 className={`font-bold text-sm ${textHeading}`}>Earn Daily Returns</h4>
                    <p className={`text-xs ${textMuted}`}>
                      Sit back as automated yields accrue daily directly into your account balance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REAL ESTATE (EXACT MATCH TO realest1_c69e98d0.png, realest2_c88df1a1.png, realest3_799d9ad6.png) */}
          {activeTab === 'real-estate' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="cursor-pointer hover:text-blue-400" onClick={() => setActiveTab('dashboard')}>
                    Home
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-500 font-semibold">Real Estate Investment</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                        Real Estate Investment
                      </h1>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        4 - 20% Annual Returns
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                      Invest in premium commercial and residential properties worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Real Estate Market Insights Row matching screenshot */}
              <div className={`rounded-3xl p-6 sm:p-7 shadow-xs border ${bgCard}`}>
                <h3 className={`text-base font-bold mb-4 ${textHeading}`}>Real Estate Market Insights</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-2xl font-extrabold text-blue-500 block">$2.4T</span>
                    <span className="text-xs text-slate-400">Global Market Size</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-2xl font-extrabold text-emerald-400 block">8.2%</span>
                    <span className="text-xs text-slate-400">Annual Growth</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-2xl font-extrabold text-cyan-400 block">15+</span>
                    <span className="text-xs text-slate-400">Property Types</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                    <span className="text-2xl font-extrabold text-indigo-400 block">50+</span>
                    <span className="text-xs text-slate-400">Global Markets</span>
                  </div>
                </div>
              </div>

              {/* Real Estate Property Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Residential Portfolio */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border ${bgCard}`}>
                  <div className="space-y-4">
                    <div className="h-40 rounded-2xl bg-cover bg-center overflow-hidden relative shadow-inner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80')` }}>
                      <div className="absolute inset-0 bg-slate-900/40"></div>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        8 - 12% Annual
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${textHeading}`}>Residential Portfolio</h3>
                      <p className={`text-xs ${textMuted}`}>Single-family rentals and multi-family residential complexes</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Min Investment:</span>
                        <span className="font-bold text-white">$500</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Lockup Period:</span>
                        <span className="font-bold text-white">12 Months</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Payout Frequency:</span>
                        <span className="font-bold text-emerald-400">Monthly</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={500}
                        value={planAmounts['re-residential'] || 500}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 're-residential': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('re-residential', 'Residential Portfolio', 500, 1000000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Invest in Residential
                    </button>
                  </div>
                </div>

                {/* 2. Commercial Development */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border ${bgCard}`}>
                  <div className="space-y-4">
                    <div className="h-40 rounded-2xl bg-cover bg-center overflow-hidden relative shadow-inner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80')` }}>
                      <div className="absolute inset-0 bg-slate-900/40"></div>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        12 - 16% Annual
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${textHeading}`}>Commercial Development</h3>
                      <p className={`text-xs ${textMuted}`}>Grade-A office parks, retail logistics, and tech hubs</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Min Investment:</span>
                        <span className="font-bold text-white">$5,000</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Lockup Period:</span>
                        <span className="font-bold text-white">24 Months</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Payout Frequency:</span>
                        <span className="font-bold text-emerald-400">Quarterly</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={5000}
                        value={planAmounts['re-commercial'] || 5000}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 're-commercial': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('re-commercial', 'Commercial Development', 5000, 5000000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Invest in Commercial
                    </button>
                  </div>
                </div>

                {/* 3. Luxury & Hospitality */}
                <div className={`rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between border ${bgCard}`}>
                  <div className="space-y-4">
                    <div className="h-40 rounded-2xl bg-cover bg-center overflow-hidden relative shadow-inner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a4d2729a68?auto=format&fit=crop&w=600&q=80')` }}>
                      <div className="absolute inset-0 bg-slate-900/40"></div>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        16 - 22% Annual
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-lg font-bold ${textHeading}`}>Luxury & Hospitality</h3>
                      <p className={`text-xs ${textMuted}`}>Five-star seaside resorts and ultra-luxury residential assets</p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Min Investment:</span>
                        <span className="font-bold text-white">$25,000</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Lockup Period:</span>
                        <span className="font-bold text-white">36 Months</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-700/30 pb-1.5">
                        <span className="text-slate-400">Payout Frequency:</span>
                        <span className="font-bold text-emerald-400">Bi-Annual</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        min={25000}
                        value={planAmounts['re-luxury'] || 25000}
                        onChange={(e) =>
                          setPlanAmounts({ ...planAmounts, 're-luxury': parseFloat(e.target.value) || 0 })
                        }
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      disabled={isInvesting}
                      onClick={() => handleJoinPlan('re-luxury', 'Luxury & Hospitality', 25000, 25000000)}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Invest in Luxury
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MY PORTFOLIO (EXACT MATCH TO folio1_12d135c0.png) */}
          {activeTab === 'my-portfolio' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="cursor-pointer hover:text-blue-400" onClick={() => setActiveTab('dashboard')}>
                    Home
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-500 font-semibold">My Portfolio</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                      My Investment Plans
                    </h1>
                    <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                      Track and manage your active investments and earnings
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('all-plans')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Investment</span>
                  </button>
                </div>
              </div>

              {/* Active Contracts or Empty State matching folio1_12d135c0.png */}
              {investments.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center border space-y-4 max-w-xl mx-auto my-12 ${bgCard}`}>
                  <div className="w-16 h-16 rounded-3xl bg-blue-600/10 text-blue-500 mx-auto flex items-center justify-center">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <h3 className={`text-lg font-bold ${textHeading}`}>No Active Investment Contracts</h3>
                  <p className={`text-xs max-w-md mx-auto ${textMuted}`}>
                    You do not have any active investment contracts running yet. Explore our high-yield plans to start earning daily compounding returns.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('all-plans')}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
                    >
                      + Start Your First Investment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {investments.map((inv) => (
                    <div key={inv.id} className={`rounded-2xl p-6 shadow-xs space-y-4 border ${bgCard}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-base text-blue-500 block">{inv.planName}</span>
                          <span className="text-xs text-slate-400 font-mono">Contract Ref: {inv.id}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {inv.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Principal</span>
                          <span className="font-bold font-mono text-white">${inv.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Daily ROI</span>
                          <span className="font-bold text-emerald-400">+{inv.dailyRoiPercent}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Yield Earned</span>
                          <span className="font-bold font-mono text-cyan-400">${inv.totalEarnedSoFar.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-400 text-[11px]">
                          <span>Timeline:</span>
                          <span>{inv.daysElapsed} of {inv.durationDays} Days Completed</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (inv.daysElapsed / inv.durationDays) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Daily Payout: ${inv.dailyEarnings.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => onClaimProfit(inv.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                        >
                          Claim Yield (${inv.dailyEarnings.toFixed(2)})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PERFORMANCE HISTORY (EXACT MATCH TO pef1_6ff05794.png) */}
          {activeTab === 'performance-history' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="cursor-pointer hover:text-blue-400" onClick={() => setActiveTab('dashboard')}>
                    Home
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-blue-500 font-semibold">Performance History</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                      Trading Overview
                    </h1>
                    <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                      Track the platform's live automated trading performance and trade history
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      setPerfLoading(true);
                      const p = await apiClient.getPerformance();
                      if (p?.records) setPerformanceRecords(p.records);
                      if (p?.stats) setPerfStats(p.stats);
                      setPerfLoading(false);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    title="Refresh performance data"
                  >
                    <RefreshCw className={`w-4 h-4 ${perfLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Stats 4-Card Row matching pef1_6ff05794.png */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${bgCard}`}>
                  <span className="text-xs text-slate-400 block font-semibold">Total Trades</span>
                  <span className={`text-2xl font-extrabold mt-1 block ${textHeading}`}>
                    {perfStats.total.toLocaleString()}
                  </span>
                </div>
                <div className={`p-5 rounded-2xl border ${bgCard}`}>
                  <span className="text-xs text-slate-400 block font-semibold">Win Rate</span>
                  <span className="text-2xl font-extrabold mt-1 block text-emerald-400">
                    {perfStats.winRate}%
                  </span>
                </div>
                <div className={`p-5 rounded-2xl border ${bgCard}`}>
                  <span className="text-xs text-slate-400 block font-semibold">Profitable Trades</span>
                  <span className="text-2xl font-extrabold mt-1 block text-blue-400">
                    {perfStats.wins.toLocaleString()}
                  </span>
                </div>
                <div className={`p-5 rounded-2xl border ${bgCard}`}>
                  <span className="text-xs text-slate-400 block font-semibold">Active Trades</span>
                  <span className="text-2xl font-extrabold mt-1 block text-amber-400">
                    {perfStats.active}
                  </span>
                </div>
              </div>

              {/* Filter Pills matching screenshot */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['all', 'win', 'loss', 'buy', 'sell'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPerfFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer border ${
                      perfFilter === filter
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : isDarkMode
                        ? 'bg-[#161c28] text-slate-400 border-slate-800 hover:text-white'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {filter === 'all' ? 'All Trades' : filter}
                  </button>
                ))}
              </div>

              {/* Live Trades Table */}
              <div className={`rounded-2xl overflow-hidden shadow-xs border ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${isDarkMode ? 'bg-[#161c28] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <tr>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Pair</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Type</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Entry Price</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Exit Price</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">P/L</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Date / Time</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {filteredPerformanceRecords.map((rec) => (
                        <tr key={rec.id} className={isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                          <td className="px-5 py-3.5 font-bold text-white font-mono">{rec.asset}</td>
                          <td className="px-5 py-3.5 font-semibold">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.type === 'buy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {rec.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono">${rec.entryPrice.toLocaleString()}</td>
                          <td className="px-5 py-3.5 font-mono">
                            {rec.exitPrice != null ? `$${rec.exitPrice.toLocaleString()}` : <span className="text-amber-400">Open</span>}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-bold">
                            <span className={rec.percentageReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                              {rec.percentageReturn >= 0 ? `+${rec.percentageReturn}%` : `${rec.percentageReturn}%`}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-slate-400 text-[11px]">{rec.timestamp}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.outcome === 'win'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : rec.outcome === 'loss'
                                ? 'bg-rose-500/10 text-rose-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {rec.outcome.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DEPOSIT FUNDS MULTI-STEP (EXACT MATCH TO pay1_1664c794.png to pay4_1d0c232b.png) */}
          {activeTab === 'deposit' && (
            <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
              <div className="text-center">
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                  Deposit Funds
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${textMuted}`}>
                  Select payment currency and transfer funds to your trading balance
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-3">
                <div className={`flex items-center gap-2 text-xs font-bold ${depositStep >= 1 ? 'text-blue-500' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${depositStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
                  <span>Select Method</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700"></div>
                <div className={`flex items-center gap-2 text-xs font-bold ${depositStep >= 2 ? 'text-blue-500' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${depositStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
                  <span>Send Crypto</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-700"></div>
                <div className={`flex items-center gap-2 text-xs font-bold ${depositStep >= 3 ? 'text-emerald-500' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${depositStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {depositStep === 1 && (
                <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-6 ${bgCard}`}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      1. Select Payment Currency
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { symbol: 'BTC', name: 'Bitcoin' },
                        { symbol: 'USDT TRC20', name: 'Tether TRC-20' },
                        { symbol: 'USDT ERC20', name: 'Tether ERC-20' },
                        { symbol: 'USDT BEP20', name: 'Tether BEP-20' },
                        { symbol: 'ETH', name: 'Ethereum' }
                      ].map((curr) => (
                        <button
                          key={curr.symbol}
                          type="button"
                          onClick={() => setDepositCurrency(curr.symbol)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                            depositCurrency === curr.symbol
                              ? 'border-blue-500 bg-blue-600/10 text-white'
                              : isDarkMode
                              ? 'border-slate-800 bg-[#161c28] text-slate-300 hover:border-slate-700'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold text-xs block">{curr.symbol}</span>
                          <span className="text-[10px] text-slate-400">{curr.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      2. Quick Amount ($)
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {['100', '500', '1000', '5000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt)}
                          className={`py-2 rounded-xl text-xs font-bold border transition ${
                            depositAmount === amt
                              ? 'bg-blue-600 text-white border-blue-500'
                              : isDarkMode
                              ? 'bg-[#161c28] border-slate-700 text-slate-300 hover:border-slate-600'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={50}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Or enter custom amount in USD"
                      className={`w-full rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none focus:border-blue-500 border ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setDepositStep(2)}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Continue to Payment Details
                  </button>
                </div>
              )}

              {depositStep === 2 && (
                <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-6 ${bgCard}`}>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700/30">
                    <h3 className={`text-base font-bold ${textHeading}`}>Complete Your Deposit</h3>
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="text-xs text-blue-400 hover:underline"
                    >
                      Change Amount
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Amount to Send</span>
                      <span className="text-xl font-extrabold text-white">${depositAmount} USD</span>
                    </div>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 text-white">
                      {depositCurrency}
                    </span>
                  </div>

                  {/* QR Code and Wallet Address */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161c28] border border-slate-700/60 text-center space-y-4">
                    <div className="p-3 bg-white rounded-2xl shadow-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentSelectedWallet.address)}`}
                        alt="Deposit QR Code"
                        className="w-36 h-36"
                      />
                    </div>
                    <div className="w-full space-y-1">
                      <span className="text-[11px] text-slate-400">Send only {depositCurrency} to this address:</span>
                      <div className="p-3 rounded-xl bg-[#0a0d14] border border-slate-700 flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-emerald-400 truncate select-all">
                          {currentSelectedWallet.address}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyDepositAddress}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedDepositAddress ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedDepositAddress ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitDeposit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Blockchain Transaction ID / Hash (Optional)
                      </label>
                      <input
                        type="text"
                        value={depositTxHash}
                        onChange={(e) => setDepositTxHash(e.target.value)}
                        placeholder="e.g. 7c9a62...39e2a"
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Payment Proof Receipt (Optional)
                      </label>
                      <label className="flex flex-col items-center justify-center p-4 border border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition">
                        <UploadCloud className="w-6 h-6 text-blue-400 mb-1" />
                        <span className="text-xs text-slate-300">
                          {depositProofFileName || 'Click to attach payment screenshot/receipt'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setDepositProofFileName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingDeposit}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmittingDeposit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>{isSubmittingDeposit ? 'Submitting Payment...' : 'I Have Paid - Submit Deposit'}</span>
                    </button>
                  </form>
                </div>
              )}

              {depositStep === 3 && depositSuccessResult && (
                <div className={`rounded-3xl p-8 shadow-xs border text-center space-y-4 ${bgCard}`}>
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className={`text-xl font-bold ${textHeading}`}>Deposit Submitted Successfully</h3>
                  <p className={`text-xs max-w-md mx-auto ${textMuted}`}>
                    Your deposit of <strong>${depositSuccessResult.amount.toFixed(2)}</strong> via {depositSuccessResult.asset} has been recorded (Ref: {depositSuccessResult.txId}). Funds will be credited after 1 network confirmation.
                  </p>
                  <div className="pt-4 flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('statement')}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700"
                    >
                      View in Statement
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDepositStep(1);
                        setActiveTab('dashboard');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: WITHDRAW FUNDS */}
          {activeTab === 'withdraw' && (
            <div className="space-y-6 animate-in fade-in max-w-xl mx-auto">
              <div className="text-center">
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                  Withdraw Funds
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${textMuted}`}>
                  Withdraw capital and profits to your external crypto wallet
                </p>
              </div>

              {withdrawStatus && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    withdrawStatus.type === 'error'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {withdrawStatus.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{withdrawStatus.text}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-5 ${bgCard}`}>
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Available Balance:</span>
                  <span className="text-lg font-bold text-white">${user.balance.toFixed(2)} USD</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Select Currency
                  </label>
                  <select
                    value={withdrawAsset}
                    onChange={(e) => setWithdrawAsset(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-semibold border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="USDT TRC20">USDT (TRC-20)</option>
                    <option value="Bitcoin BTC">Bitcoin (BTC)</option>
                    <option value="Ethereum ETH">Ethereum (ETH / ERC-20)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Withdrawal Amount ($)
                  </label>
                  <input
                    type="number"
                    min={20}
                    step="any"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min $20.00"
                    required
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono font-bold border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Destination Wallet Address
                  </label>
                  <input
                    type="text"
                    value={withdrawDestination}
                    onChange={(e) => setWithdrawDestination(e.target.value)}
                    placeholder="Enter your external crypto address"
                    required
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {isWithdrawing ? 'Processing Withdrawal...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: PROFILE SETTINGS (EXACT MATCH TO profile2_9f942038.png to profile-security2_11fe3c5e.png) */}
          {activeTab === 'profile-settings' && (
            <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
              {/* Profile Top Banner Card matching profile2_9f942038.png */}
              <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border flex flex-col sm:flex-row items-center sm:items-start gap-5 ${bgCard}`}>
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md shrink-0">
                  {(user.displayName || user.uid).charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h2 className={`text-xl font-bold ${textHeading}`}>
                      {user.displayName || user.uid}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-center sm:self-auto">
                      VERIFIED ACCOUNT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{user.email}</p>
                  <p className="text-[11px] text-slate-500">
                    Username: <span className="font-mono text-slate-300">@{user.username || 'ouimasbot'}</span> &bull; Member since 2026
                  </p>
                </div>
              </div>

              {/* Tabs: Personal Information & Security */}
              <div className="flex items-center gap-3 border-b border-slate-700/40 pb-1">
                <button
                  type="button"
                  onClick={() => setProfileTab('personal')}
                  className={`pb-3 px-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                    profileTab === 'personal'
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Personal Information
                </button>
                <button
                  type="button"
                  onClick={() => setProfileTab('security')}
                  className={`pb-3 px-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                    profileTab === 'security'
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  Security
                </button>
              </div>

              {profileUpdateStatus && (
                <div
                  className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                    profileUpdateStatus.type === 'error'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  }`}
                >
                  {profileUpdateStatus.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                  <span>{profileUpdateStatus.text}</span>
                </div>
              )}

              {/* Sub-tab 1: Personal Information */}
              {profileTab === 'personal' && (
                <form onSubmit={handleSaveProfile} className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-5 ${bgCard}`}>
                  <h3 className={`text-base font-bold ${textHeading}`}>Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <span>Email Address</span>
                        <Lock className="w-3 h-3 text-slate-500" />
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className={`w-full rounded-xl px-4 py-2.5 text-xs border cursor-not-allowed opacity-70 ${
                          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Country of Residence
                    </label>
                    <select
                      value={editCountry}
                      onChange={(e) => setEditCountry(e.target.value)}
                      className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Bahamas">Bahamas</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="Australia">Australia</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {/* Sub-tab 2: Security matching profile-security_215de5bc.png & profile-security2_11fe3c5e.png */}
              {profileTab === 'security' && (
                <div className="space-y-6">
                  {passwordStatus && (
                    <div
                      className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                        passwordStatus.type === 'error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {passwordStatus.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
                      <span>{passwordStatus.text}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordResetSubmit} className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-5 ${bgCard}`}>
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-700/20">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-base font-bold ${textHeading}`}>Change Password</h3>
                        <p className={`text-xs ${textMuted}`}>Protect your account with a secure password</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 8 characters"
                          className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                            isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className={`w-full rounded-xl px-4 py-2.5 text-xs border ${
                            isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Requirements checklist */}
                    <div className={`p-4 rounded-2xl text-xs space-y-2 border ${isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="font-bold text-[11px] text-slate-300 block">Password Requirements:</span>
                      <div className="flex items-center gap-2">
                        <Check className={`w-3.5 h-3.5 ${newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`w-3.5 h-3.5 ${/[A-Z]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>At least one uppercase character</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`w-3.5 h-3.5 ${/[0-9]/.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>At least one numeric digit</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB: REFERRALS */}
          {activeTab === 'referrals' && (
            <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
              <div className="text-center">
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                  Referral Program
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${textMuted}`}>
                  Share your affiliate link and earn up to 10% instant commission on partner deposits
                </p>
              </div>

              <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-5 ${bgCard}`}>
                <h3 className={`text-base font-bold ${textHeading}`}>Your Unique Referral Link</h3>
                <div className="p-3.5 rounded-xl bg-[#0a0d14] border border-slate-700 flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-cyan-400 truncate select-all">{referralUrl}</span>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUPPORT CENTER */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
              <div className="text-center">
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                  Support Center
                </h1>
                <p className={`text-xs sm:text-sm mt-1 ${textMuted}`}>
                  24/7 client relations, compliance, and automated technical assistance
                </p>
              </div>

              <div className={`rounded-3xl p-6 sm:p-8 shadow-xs border space-y-4 ${bgCard}`}>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-bold text-sm">Direct Support Email</h4>
                    <p className="text-xs text-slate-400">support@quantumindustrialpartnership.net</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-700/30">
                  <Phone className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-sm">Priority Client Desk</h4>
                    <p className="text-xs text-slate-400">+1 (242) 555-0199 (Mon-Fri 08:00 - 18:00 EST)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NOTIFICATIONS (EXACT MATCH TO darkmode_8bb6d740.png) */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                      Notifications
                    </h1>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                    Your personal notification center for staying updated with important system alerts and messages
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllRead}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-blue-500/20"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold mr-1 flex items-center gap-1 ${textMuted}`}>
                    Filter:
                  </span>
                  {(['all', 'unread', 'read'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setNotifFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                        notifFilter === filter
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-[#161c28] text-slate-400 hover:text-white'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notifSearch}
                    onChange={(e) => setNotifSearch(e.target.value)}
                    placeholder="Search notifications..."
                    className={`rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-64 border transition ${
                      isDarkMode
                        ? 'bg-[#161c28] border-slate-700/60 text-slate-200 placeholder-slate-500'
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Notification Cards List */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className={`rounded-2xl p-8 text-center border ${bgCard}`}>
                    <p className="text-xs text-slate-400">No notifications match your current filter.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition ${
                        isDarkMode
                          ? notif.read
                            ? 'bg-[#121723]/60 border-[#1e2638] text-slate-300'
                            : 'bg-[#161c28] border-blue-500/30 text-white shadow-xs'
                          : notif.read
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-blue-50/50 border-blue-200 text-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Info className="w-4 h-4" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm">{notif.title}</h3>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                            )}
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold text-[10px]">
                              {notif.tag}
                            </span>
                            <span>{notif.timeAgo}</span>
                            <span>&bull;</span>
                            <span>{notif.read ? 'Read' : 'Unread'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedNotifModal(notif)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            isDarkMode
                              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        {!notif.read && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(notif.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-400 hover:bg-blue-500/10 transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Read</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT STATEMENT (FULL FINANCIAL AUDIT & TRANSACTIONS) */}
          {activeTab === 'statement' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                    Account Statement
                  </h1>
                  <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                    Detailed record of all deposits, withdrawals, yield accruals, and settlements
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={exportStatementCsv}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={onRefreshUserData}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className={`rounded-2xl overflow-hidden shadow-xs border ${bgCard}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${isDarkMode ? 'bg-[#161c28] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <tr>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Type</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Amount</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Asset / Method</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Date / Time</th>
                        <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px]">Tx Hash</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                            No ledger transactions recorded yet. Initiate your first deposit to start.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className={isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                            <td className="px-5 py-3.5 font-semibold capitalize flex items-center gap-2">
                              {tx.type === 'deposit' ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              ) : tx.type === 'withdrawal' ? (
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              )}
                              <span>{tx.type}</span>
                            </td>
                            <td className="px-5 py-3.5 font-mono font-bold">
                              ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-3.5 text-slate-400">{tx.asset}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {tx.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">{tx.timestamp}</td>
                            <td className="px-5 py-3.5 font-mono text-slate-500 text-[11px] truncate max-w-[140px]">
                              {tx.txHash}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WALLET & FINANCE */}
          {activeTab === 'wallet' && (
            <div className="space-y-6 animate-in fade-in max-w-4xl">
              <div>
                <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                  Wallet & Financial Settings
                </h1>
                <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                  Configure crypto withdrawal payout addresses and funding balances
                </p>
              </div>

              {walletSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Wallet addresses saved successfully to database records.</span>
                </div>
              )}

              <form onSubmit={handleSaveWallets} className={`rounded-2xl p-6 sm:p-7 shadow-xs space-y-5 border ${bgCard}`}>
                <h3 className={`text-base font-bold ${textHeading}`}>Saved Payout Wallets</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    USDT (TRC-20) Payout Address
                  </label>
                  <input
                    type="text"
                    value={usdtWallet}
                    onChange={(e) => setUsdtWallet(e.target.value)}
                    placeholder="e.g. TYD5j1Xn8dK2mP9v7B4r6s8t0u1w2x3y4z"
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Bitcoin (BTC) Address
                  </label>
                  <input
                    type="text"
                    value={btcWallet}
                    onChange={(e) => setBtcWallet(e.target.value)}
                    placeholder="e.g. bc1q9v0z4p7m63f9k2j0h1w8s4e5r3t6y8u9i0o1p2"
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Ethereum (ETH / ERC-20) Address
                  </label>
                  <input
                    type="text"
                    value={ethWallet}
                    onChange={(e) => setEthWallet(e.target.value)}
                    placeholder="e.g. 0x71C...B3F48a928B319b24"
                    className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 border ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save Payout Addresses
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: INTERNAL TRANSFER / TRANSFER FUNDS (EXACT MATCH TO transfer.png) */}
          {activeTab === 'transfer' && (
            <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
              {/* Top Header matching transfer.png */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-extrabold ${textHeading}`}>
                    Transfer Funds
                  </h1>
                  <p className={`text-xs sm:text-sm mt-0.5 ${textMuted}`}>
                    Send funds securely to other platform users
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition cursor-pointer self-start sm:self-auto ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </button>
              </div>

              {/* Centered Available Balance Card matching transfer.png */}
              <div className="max-w-xl mx-auto">
                <div className={`rounded-2xl p-6 sm:p-7 shadow-xs flex items-center justify-between border ${bgCard}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-[#182030] text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                      <span className={`text-xs font-semibold ${textMuted} block`}>
                        Available Balance
                      </span>
                      <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textHeading}`}>
                        ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('deposit')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-blue-500 hover:bg-blue-500/10 border border-blue-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Top Up</span>
                  </button>
                </div>
              </div>

              {/* Main Send Funds Card matching transfer.png */}
              <div className="max-w-xl mx-auto">
                <div className={`rounded-2xl p-6 sm:p-8 shadow-xs border space-y-6 ${bgCard}`}>
                  {/* Header with paper plane icon */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-slate-700/20">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold ${textHeading}`}>Send Funds</h2>
                      <p className={`text-xs ${textMuted}`}>Transfer funds to another user account</p>
                    </div>
                  </div>

                  {/* Status alert message */}
                  {transferStatus && (
                    <div
                      className={`p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5 border ${
                        transferStatus.type === 'error'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {transferStatus.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      ) : (
                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p>{transferStatus.message}</p>
                        {transferStatus.txId && (
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            Transaction Ref: {transferStatus.txId}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleInternalTransferSubmit} className="space-y-5">
                    {/* Recipient Account Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        Recipient Account <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={transferRecipient}
                          onChange={(e) => setTransferRecipient(e.target.value)}
                          placeholder="Enter recipient username or email address"
                          className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 border transition ${
                            isDarkMode
                              ? 'bg-[#161c28] border-slate-700 text-white placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                        Enter the registered email or username of the recipient
                      </p>
                    </div>

                    {/* Transfer Amount Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-300">
                          Transfer Amount <span className="text-rose-500">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setTransferAmount(user.balance.toString())}
                          className="text-[11px] font-bold text-blue-500 hover:text-blue-400 cursor-pointer"
                        >
                          Use Max (${user.balance.toFixed(2)})
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                          $
                        </div>
                        <input
                          type="number"
                          step="any"
                          min="50"
                          required
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                          placeholder="0.00"
                          className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 border transition ${
                            isDarkMode
                              ? 'bg-[#161c28] border-slate-700 text-white placeholder-slate-500'
                              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                        Minimum transfer amount: $50.00
                      </p>
                    </div>

                    {/* Transfer Information Box matching transfer.png */}
                    <div className={`p-4 rounded-xl border flex gap-3 ${
                      isDarkMode
                        ? 'bg-blue-950/20 border-blue-900/40 text-slate-300'
                        : 'bg-blue-50/70 border-blue-100 text-slate-700'
                    }`}>
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1">
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          Transfer Information
                        </h4>
                        <p className="text-slate-400">
                          Transfer fee: <span className="font-bold text-emerald-500">0%</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Transfers between platform users are instant and free of charge.
                        </p>
                      </div>
                    </div>

                    {/* Submit Button (Dark Navy button matching transfer.png) */}
                    <button
                      type="submit"
                      disabled={isTransferring}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition cursor-pointer ${
                        isTransferring
                          ? 'bg-slate-700 cursor-not-allowed opacity-70'
                          : 'bg-[#0b2d64] hover:bg-[#071f46] shadow-blue-950/40 active:scale-[0.99]'
                      }`}
                    >
                      {isTransferring ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Processing Transfer...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transfer Funds</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN CONSOLE (ROUTE-GUARDED FOR ADMIN ROLE) */}
          {activeTab === 'admin' && (
            <AdminConsole
              currentUser={user}
              plans={plans}
              isDarkMode={isDarkMode}
              onRefreshData={onRefreshUserData}
            />
          )}
        </main>
      </div>

      {/* NOTIFICATION DETAIL MODAL */}
      {selectedNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative animate-in fade-in zoom-in-95 ${
            isDarkMode ? 'bg-[#121723] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{selectedNotifModal.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {selectedNotifModal.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotifModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedNotifModal.message}</p>

              <div className={`p-3.5 rounded-xl space-y-1.5 border ${
                isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-blue-400">{selectedNotifModal.tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-mono text-slate-300">{selectedNotifModal.timestamp}</span>
                </div>
                {selectedNotifModal.ip && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client IP:</span>
                    <span className="font-mono text-emerald-400">{selectedNotifModal.ip}</span>
                  </div>
                )}
                {selectedNotifModal.userAgent && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Browser / Agent:</span>
                    <span className="font-semibold text-slate-300">{selectedNotifModal.userAgent}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
              {!selectedNotifModal.read && (
                <button
                  type="button"
                  onClick={() => {
                    handleMarkRead(selectedNotifModal.id);
                    setSelectedNotifModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Mark as Read
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedNotifModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
