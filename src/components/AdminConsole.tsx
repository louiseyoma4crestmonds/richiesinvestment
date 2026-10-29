import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Building,
  CreditCard,
  QrCode,
  Copy,
  Clock,
  RotateCcw,
  MessageSquare,
  Send,
  CheckCheck,
  UserPlus,
  KeyRound,
  UserX
} from 'lucide-react';
import { UserProfile, Transaction, AdminDepositWallet, InvestmentPlan, ChatConversation, ChatMessage } from '../server/db.ts';
import { apiClient } from '../services/apiClient.ts';

interface AdminConsoleProps {
  currentUser: UserProfile;
  plans: InvestmentPlan[];
  isDarkMode: boolean;
  onRefreshData?: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  currentUser,
  plans,
  isDarkMode,
  onRefreshData
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'transfers' | 'wallets' | 'chats'>('users');

  // Admin Data State
  const [users, setUsers] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<AdminDepositWallet[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Create User Modal State
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createDisplayName, setCreateDisplayName] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('Quantum2026!');
  const [createRole, setCreateRole] = useState<'user' | 'admin'>('user');
  const [createBalance, setCreateBalance] = useState('5000');
  const [createProfit, setCreateProfit] = useState('0');
  const [createBonus, setCreateBonus] = useState('0');
  const [createCountry, setCreateCountry] = useState('United Kingdom');
  const [createPhone, setCreatePhone] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [editPassword, setEditPassword] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editProfit, setEditProfit] = useState('');
  const [editBonus, setEditBonus] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);

  // Delete User Confirmation State
  const [deletingUser, setDeletingUser] = useState<any | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Add Investment Modal State
  const [investTargetUser, setInvestTargetUser] = useState<any | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || 'veteran-plan');
  const [investAmount, setInvestAmount] = useState('500');
  const [isAddingInvest, setIsAddingInvest] = useState(false);

  // Add Wallet Modal State
  const [newWalletCurrency, setNewWalletCurrency] = useState('BITCOIN (BTC)');
  const [newWalletNetwork, setNewWalletNetwork] = useState('BTC (Bitcoin)');
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletMin, setNewWalletMin] = useState('50');
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Load Admin Data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, transfersRes, walletsRes, chatsRes] = await Promise.allSettled([
        apiClient.getAdminUsers(currentUser.uid),
        apiClient.getAdminTransfers(currentUser.uid),
        apiClient.getAdminWallets(currentUser.uid),
        apiClient.getChatConversations()
      ]);

      if (usersRes.status === 'fulfilled' && usersRes.value?.success) {
        setUsers(usersRes.value.data);
      }
      if (transfersRes.status === 'fulfilled' && transfersRes.value?.success) {
        setTransfers(transfersRes.value.data);
      }
      if (walletsRes.status === 'fulfilled' && walletsRes.value?.success) {
        setWallets(walletsRes.value.data);
      }
      if (chatsRes.status === 'fulfilled' && chatsRes.value?.success && Array.isArray(chatsRes.value.data)) {
        setConversations(chatsRes.value.data);
        if (!selectedConvId && chatsRes.value.data.length > 0) {
          setSelectedConvId(chatsRes.value.data[0].id);
        }
      }
    } catch (err: any) {
      showFeedback('error', 'Error loading admin data: ' + err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
    const chatInterval = setInterval(async () => {
      try {
        const chatsRes = await apiClient.getChatConversations();
        if (chatsRes?.success && Array.isArray(chatsRes.data)) {
          setConversations(chatsRes.data);
        }
      } catch {
        // silent poll
      }
    }, 4000);
    return () => clearInterval(chatInterval);
  }, [currentUser.uid]);

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConvId || !adminReplyText.trim() || isReplying) return;
    setIsReplying(true);
    try {
      const res = await apiClient.replyChatMessage({
        conversationId: selectedConvId,
        replyText: adminReplyText.trim(),
        adminName: currentUser.displayName || 'QUANTUM PLUS Admin'
      });
      if (res?.success) {
        setAdminReplyText('');
        showFeedback('success', 'Live reply sent to user.');
        const chatsRes = await apiClient.getChatConversations();
        if (chatsRes?.success) setConversations(chatsRes.data);
      } else {
        showFeedback('error', res?.error || 'Failed to send reply');
      }
    } catch (err: any) {
      showFeedback('error', 'Error sending reply: ' + err?.message);
    } finally {
      setIsReplying(false);
    }
  };

  // Route Guard Check
  if (currentUser.role !== 'admin' && currentUser.uid !== 'admin') {
    return (
      <div className={`p-8 rounded-3xl border text-center space-y-4 max-w-xl mx-auto my-12 ${
        isDarkMode ? 'bg-rose-950/20 border-rose-900/50 text-white' : 'bg-rose-50 border-rose-200 text-slate-900'
      }`}>
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-rose-500">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          This portal requires QUANTUM PLUS Administrator privileges. Your current session is <strong>{currentUser.displayName || currentUser.uid}</strong> ({currentUser.role || 'user'}).
        </p>
      </div>
    );
  }

  // Handle Create New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUsername.trim() || !createEmail.trim()) {
      showFeedback('error', 'Username and email are required to create an account.');
      return;
    }
    setIsCreatingUser(true);
    try {
      const res = await apiClient.createAdminUser(currentUser.uid, {
        displayName: createDisplayName.trim() || createUsername.trim(),
        username: createUsername.trim(),
        email: createEmail.trim(),
        password: createPassword.trim() || 'Quantum2026!',
        role: createRole,
        balance: Number(createBalance) || 0,
        profit: Number(createProfit) || 0,
        bonus: Number(createBonus) || 0,
        country: createCountry.trim(),
        phone: createPhone.trim()
      });

      if (res.success) {
        showFeedback('success', res.message || 'User account created successfully.');
        setShowCreateUserModal(false);
        setCreateDisplayName('');
        setCreateUsername('');
        setCreateEmail('');
        setCreatePhone('');
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        showFeedback('error', res.error || 'Failed to create user account.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error creating user: ' + err?.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Handle Save / Edit Existing User (Profile & Finances)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingUser(true);
    try {
      const res = await apiClient.updateAdminUser(currentUser.uid, editingUser.uid, {
        displayName: editDisplayName.trim(),
        username: editUsername.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        country: editCountry.trim(),
        role: editRole,
        password: editPassword.trim() || undefined,
        balance: parseFloat(editBalance) || 0,
        profit: parseFloat(editProfit) || 0,
        bonus: parseFloat(editBonus) || 0
      });

      if (res.success) {
        showFeedback('success', res.message || `Account updated for ${editingUser.displayName || editingUser.uid}`);
        setEditingUser(null);
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        showFeedback('error', res.error || 'Failed to update user profile.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error updating user: ' + err?.message);
    } finally {
      setIsSavingUser(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeletingUser(true);
    try {
      const res = await apiClient.deleteAdminUser(currentUser.uid, deletingUser.uid);
      if (res.success) {
        showFeedback('success', res.message || 'User account deleted permanently.');
        setDeletingUser(null);
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        showFeedback('error', res.error || 'Failed to delete user.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error deleting user: ' + err?.message);
    } finally {
      setIsDeletingUser(false);
    }
  };

  // Handle Admin Direct Investment Assignment
  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investTargetUser) return;
    setIsAddingInvest(true);
    try {
      const res = await apiClient.manageUserInvestment({
        adminUid: currentUser.uid,
        targetUid: investTargetUser.uid,
        action: 'add',
        planId: selectedPlanId,
        amount: parseFloat(investAmount) || 500
      });

      if (res.success) {
        showFeedback('success', `Investment allocated for ${investTargetUser.displayName}`);
        setInvestTargetUser(null);
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        showFeedback('error', res.error || 'Failed to allocate investment.');
      }
    } catch (err: any) {
      showFeedback('error', 'Network error: ' + err?.message);
    } finally {
      setIsAddingInvest(false);
    }
  };

  // Handle Reversal of Internal Transfer
  const handleReverseTransfer = async (transferId: string) => {
    if (!confirm('Are you sure you want to reverse this transfer and refund the funds back to the sender?')) return;
    try {
      const res = await apiClient.manageTransfer({
        adminUid: currentUser.uid,
        transferId,
        action: 'reverse'
      });
      if (res.success) {
        showFeedback('success', `Transfer #${transferId} has been reversed and refunded.`);
        loadAdminData();
        if (onRefreshData) onRefreshData();
      } else {
        showFeedback('error', res.error || 'Failed to reverse transfer.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error: ' + err?.message);
    }
  };

  // Handle Add Receiving Wallet
  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletAddress.trim()) return;
    setIsAddingWallet(true);
    try {
      const res = await apiClient.addAdminWallet({
        adminUid: currentUser.uid,
        currency: newWalletCurrency,
        network: newWalletNetwork,
        address: newWalletAddress.trim(),
        minDeposit: parseFloat(newWalletMin) || 50
      });
      if (res.success) {
        showFeedback('success', `Deposit receiving wallet for ${newWalletCurrency} added.`);
        setNewWalletAddress('');
        setShowAddWalletModal(false);
        loadAdminData();
      } else {
        showFeedback('error', res.error || 'Failed to add wallet address.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error: ' + err?.message);
    } finally {
      setIsAddingWallet(false);
    }
  };

  // Handle Delete Receiving Wallet
  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Remove this receiving deposit address?')) return;
    try {
      const res = await apiClient.deleteAdminWallet(currentUser.uid, id);
      if (res.success) {
        showFeedback('success', 'Receiving deposit wallet removed.');
        loadAdminData();
      } else {
        showFeedback('error', res.error || 'Failed to delete wallet.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error: ' + err?.message);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.displayName?.toLowerCase().includes(q) ||
      u.uid?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  const bgCard = isDarkMode ? 'bg-[#121723] border border-[#1e2638]' : 'bg-white border border-slate-200 shadow-xs';
  const textHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-r from-purple-950/60 via-[#121723] to-[#0a0d14] border-purple-900/40 text-white'
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">QUANTUM PLUS Admin Console</h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-500 text-white uppercase tracking-wider">
                  ROOT PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                Manage accounts, financial balances, active contracts, deposit gateway addresses, and internal user transfers
              </p>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh System Data</span>
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
            actionMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}
        >
          {actionMessage.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Admin Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/20 pb-3">
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : isDarkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Finances ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('transfers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'transfers'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : isDarkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>User Internal Transfers ({transfers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('wallets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'wallets'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : isDarkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Deposit Receiving Wallets ({wallets.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('chats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
            activeAdminSubTab === 'chats'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : isDarkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live User Support Chats ({conversations.length})</span>
          {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0) > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
              {conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0)} NEW
            </span>
          )}
        </button>
      </div>

      {/* SUBTAB 1: USERS & FINANCIAL OVERVIEW */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user name, email, or UID..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-purple-500 ${
                  isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <button
              onClick={() => {
                setCreateDisplayName('');
                setCreateUsername('');
                setCreateEmail('');
                setCreatePassword('Quantum2026!');
                setCreateRole('user');
                setCreateBalance('5000');
                setCreateProfit('0');
                setCreateBonus('0');
                setCreateCountry('United Kingdom');
                setCreatePhone('');
                setShowCreateUserModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-purple-600/30 shrink-0 w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          </div>

          <div className={`rounded-2xl border overflow-hidden ${bgCard}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase text-[10px] font-bold tracking-wider ${
                  isDarkMode ? 'bg-[#182030] text-slate-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Balance</th>
                    <th className="px-5 py-3.5">Profit</th>
                    <th className="px-5 py-3.5">Bonus</th>
                    <th className="px-5 py-3.5">Active Contracts</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No registered users match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.uid} className={isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center uppercase shadow-xs">
                              {u.displayName?.charAt(0) || u.uid.charAt(0)}
                            </div>
                            <div>
                              <span className={`font-bold block ${textHeading}`}>{u.displayName || u.uid}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`}>
                            {u.role ? u.role.toUpperCase() : 'USER'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                          ${(u.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-cyan-400">
                          ${(u.profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 font-mono font-semibold text-amber-400">
                          ${(u.bonus || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 font-semibold">
                          {u.activeInvestmentsCount || 0} contracts
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit User Profile & Finances */}
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditDisplayName(u.displayName || '');
                                setEditUsername(u.username || u.uid);
                                setEditEmail(u.email || '');
                                setEditPhone(u.phone || '');
                                setEditCountry(u.country || 'United Kingdom');
                                setEditRole(u.role === 'admin' ? 'admin' : 'user');
                                setEditPassword('');
                                setEditBalance(String(u.balance || 0));
                                setEditProfit(String(u.profit || 0));
                                setEditBonus(String(u.bonus || 0));
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Edit User Profile & Finances"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Allocate Plan */}
                            <button
                              onClick={() => {
                                setInvestTargetUser(u);
                                setInvestAmount('1000');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                              title="Allocate Investment Plan"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Plan</span>
                            </button>

                            {/* Delete User (Disabled for root admin) */}
                            {u.uid !== 'admin' && (
                              <button
                                onClick={() => setDeletingUser(u)}
                                className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                                title="Delete User Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
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

      {/* SUBTAB 2: INTERNAL TRANSFERS MONITOR */}
      {activeAdminSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className={`rounded-2xl border overflow-hidden ${bgCard}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase text-[10px] font-bold tracking-wider ${
                  isDarkMode ? 'bg-[#182030] text-slate-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  <tr>
                    <th className="px-5 py-3.5">Ref ID</th>
                    <th className="px-5 py-3.5">Sender</th>
                    <th className="px-5 py-3.5">Details / Recipient</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                        No internal transfers logged on the platform yet.
                      </td>
                    </tr>
                  ) : (
                    transfers.map((tx) => (
                      <tr key={tx.id} className={isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{tx.id}</td>
                        <td className="px-5 py-3.5 font-bold text-white">{tx.userName || tx.userId}</td>
                        <td className="px-5 py-3.5 text-slate-300">{tx.note || 'Internal Transfer'}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-blue-400">${tx.amount.toFixed(2)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400">{tx.timestamp}</td>
                        <td className="px-5 py-3.5 text-right">
                          {tx.status === 'completed' && (
                            <button
                              onClick={() => handleReverseTransfer(tx.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs flex items-center gap-1 ml-auto transition cursor-pointer"
                              title="Reverse transfer & refund funds to sender"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reverse & Refund</span>
                            </button>
                          )}
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

      {/* SUBTAB 3: DEPOSIT RECEIVING WALLETS */}
      {activeAdminSubTab === 'wallets' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold ${textHeading}`}>Active Crypto Deposit Gateways</h3>
              <p className={`text-xs ${textMuted}`}>
                Manage blockchain receiving addresses that appear in user deposit screens
              </p>
            </div>

            <button
              onClick={() => setShowAddWalletModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Receiving Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((w) => (
              <div key={w.id} className={`p-5 rounded-2xl border space-y-3.5 ${bgCard}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${textHeading}`}>{w.currency}</h4>
                      <span className="text-[11px] text-slate-400 font-medium">{w.network}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteWallet(w.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    title="Remove address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-[#161c28] border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="font-mono text-xs text-slate-300 truncate max-w-[280px]">
                    {w.address}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(w.address);
                      showFeedback('success', `Copied ${w.currency} address`);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Minimum Deposit:</span>
                  <span className="font-bold text-emerald-400">${w.minDeposit}.00</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: LIVE SUPPORT CHATS */}
      {activeAdminSubTab === 'chats' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold">Live User Chat Center</h3>
              <p className="text-xs text-slate-400">Incoming inquiries from platform investors with instant two-way messaging</p>
            </div>
            <button
              onClick={loadAdminData}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-600/30 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Chats</span>
            </button>
          </div>

          <div className={`rounded-3xl border overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[520px] ${
            isDarkMode ? 'bg-[#121723] border-slate-700/60' : 'bg-white border-slate-200'
          }`}>
            {/* Left Column: Conversations List */}
            <div className={`md:col-span-4 border-r overflow-y-auto max-h-[580px] p-3 space-y-2 ${
              isDarkMode ? 'border-slate-700/60 bg-slate-950/40' : 'border-slate-200 bg-slate-50/70'
            }`}>
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Active Inquiries ({conversations.length})
              </div>

              {conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <p>No active chat inquiries yet.</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = selectedConvId === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        apiClient.markChatRead(conv.id);
                        setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                      }}
                      className={`p-3 rounded-2xl cursor-pointer transition flex items-start gap-3 border ${
                        isSelected
                          ? 'bg-purple-600/15 border-purple-500/50 shadow-sm'
                          : isDarkMode
                          ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-900'
                          : 'bg-white border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {conv.userName ? conv.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold truncate text-slate-200">{conv.userName || 'Investor'}</h4>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{conv.lastUpdated}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate leading-tight">{conv.lastMessage || 'New message'}</p>
                        <div className="flex items-center justify-between gap-1 mt-1.5">
                          <span className="text-[9px] text-purple-400 font-mono truncate">{conv.userEmail || conv.userId}</span>
                          {conv.unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold shrink-0 animate-pulse">
                              {conv.unreadCount} NEW
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Chat Stream & Reply Form */}
            <div className="md:col-span-8 flex flex-col justify-between h-[580px]">
              {(() => {
                const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
                if (!activeConv) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
                      <MessageSquare className="w-12 h-12 mb-3 text-slate-600" />
                      <p>Select an inquiry on the left to review message thread</p>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Header */}
                    <div className={`p-4 border-b flex items-center justify-between ${
                      isDarkMode ? 'border-slate-700/60 bg-slate-900/30' : 'border-slate-200 bg-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {activeConv.userName ? activeConv.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-100">{activeConv.userName}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                              Investor
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">{activeConv.userEmail || `User UID: ${activeConv.userId}`}</p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        <span>Conv ID: <strong className="font-mono text-purple-400">{activeConv.id}</strong></span>
                      </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className={`flex-1 p-4 overflow-y-auto space-y-3 text-xs ${
                      isDarkMode ? 'bg-[#0e131e]' : 'bg-slate-50'
                    }`}>
                      {(!activeConv.messages || activeConv.messages.length === 0) ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                          No messages yet in this conversation.
                        </div>
                      ) : (
                        activeConv.messages.map((m) => (
                          <div
                            key={m.id}
                            className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1">
                              <span className="text-[10px] font-bold text-slate-400">
                                {m.sender === 'admin' ? '🛡️ You (QUANTUM PLUS Admin)' : m.senderName || activeConv.userName}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">{m.timeAgo || new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-xs text-xs ${
                                m.sender === 'admin'
                                  ? 'bg-purple-600 text-white rounded-br-none'
                                  : isDarkMode
                                  ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none shadow-md'
                                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                              }`}
                            >
                              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Admin Reply Input */}
                    <form
                      onSubmit={handleSendAdminReply}
                      className={`p-3.5 border-t flex items-center gap-2 ${
                        isDarkMode ? 'border-slate-700/60 bg-slate-900/50' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <input
                        type="text"
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder={`Reply to ${activeConv.userName}...`}
                        className={`flex-1 text-xs px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                          isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <button
                        type="submit"
                        disabled={isReplying || !adminReplyText.trim()}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-600/30"
                      >
                        {isReplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT USER PROFILE & FINANCES */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border relative animate-in fade-in zoom-in-95 my-8 ${
            isDarkMode ? 'bg-[#121723] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Edit User Account</h3>
                  <p className="text-xs text-slate-400">UID: <span className="font-mono">{editingUser.uid}</span></p>
                </div>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="py-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Full Name / Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="e.g. jdoe24"
                    className={`w-full rounded-xl px-4 py-2.5 font-mono border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="user@example.com"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">System Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="user">Standard User (Investor)</option>
                    <option value="admin">Administrator (Super Admin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Country / Jurisdiction</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-purple-500/5">
                <label className="block font-bold text-purple-400 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Password (Optional)</span>
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Leave empty to keep user's current password"
                  className={`w-full rounded-xl px-4 py-2 text-xs border focus:outline-none focus:border-purple-500 ${
                    isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="border-t border-slate-700/30 pt-3">
                <span className="font-bold text-slate-400 block mb-2 uppercase text-[10px] tracking-wider">Account Balances</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Balance ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={editBalance}
                      onChange={(e) => setEditBalance(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Profit ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={editProfit}
                      onChange={(e) => setEditProfit(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Bonus ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={editBonus}
                      onChange={(e) => setEditBonus(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  {isSavingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW USER */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border relative animate-in fade-in zoom-in-95 my-8 ${
            isDarkMode ? 'bg-[#121723] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Create New User Account</h3>
                  <p className="text-xs text-slate-400">Add an investor or administrator directly to the system</p>
                </div>
              </div>
              <button onClick={() => setShowCreateUserModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="py-4 space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={createDisplayName}
                    onChange={(e) => setCreateDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={createUsername}
                    onChange={(e) => setCreateUsername(e.target.value)}
                    placeholder="e.g. alexmorgan"
                    className={`w-full rounded-xl px-4 py-2.5 font-mono border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Initial Password</label>
                  <input
                    type="text"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Quantum2026!"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Role</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as 'user' | 'admin')}
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="user">User (Investor)</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={createCountry}
                    onChange={(e) => setCreateCountry(e.target.value)}
                    placeholder="United Kingdom"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Phone (Optional)</label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="border-t border-slate-700/30 pt-3">
                <span className="font-bold text-slate-400 block mb-2 uppercase text-[10px] tracking-wider">Initial Account Credits</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Balance ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={createBalance}
                      onChange={(e) => setCreateBalance(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Profit ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={createProfit}
                      onChange={(e) => setCreateProfit(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">Bonus ($)</label>
                    <input
                      type="number"
                      step="any"
                      value={createBonus}
                      onChange={(e) => setCreateBonus(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                        isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  {isCreatingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE USER CONFIRMATION */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border relative animate-in fade-in zoom-in-95 ${
            isDarkMode ? 'bg-[#121723] border-rose-900/40 text-white' : 'bg-white border-rose-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-500">Delete User Account</h3>
                <p className="text-xs text-slate-400">Irreversible administrative action</p>
              </div>
            </div>

            <div className="py-3 text-xs text-slate-300 space-y-2">
              <p>
                Are you sure you want to permanently delete the account for <strong className="text-white">{deletingUser.displayName || deletingUser.uid}</strong> (<span className="font-mono text-purple-400">{deletingUser.email}</span>)?
              </p>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px]">
                This will delete their user profile, active investment contracts, transaction logs, and credentials.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700/30">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                disabled={isDeletingUser}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs cursor-pointer hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeletingUser}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/30"
              >
                {isDeletingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD DIRECT INVESTMENT CONTRACT */}
      {investTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative animate-in fade-in zoom-in-95 ${
            isDarkMode ? 'bg-[#121723] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Allocate Investment Contract</h3>
                  <p className="text-xs text-slate-400">Target: {investTargetUser.displayName || investTargetUser.uid}</p>
                </div>
              </div>
              <button onClick={() => setInvestTargetUser(null)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleAddInvestment} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Select Investment Strategy</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                    isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.dailyRoiPercent}% Daily, {p.durationDays} Days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Principal Capital Amount ($)</label>
                <input
                  type="number"
                  step="any"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 font-mono text-sm border focus:outline-none focus:border-purple-500 ${
                    isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setInvestTargetUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingInvest}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {isAddingInvest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Confirm Allocation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RECEIVING DEPOSIT WALLET */}
      {showAddWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border relative animate-in fade-in zoom-in-95 ${
            isDarkMode ? 'bg-[#121723] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Add Deposit Receiving Address</h3>
                  <p className="text-xs text-slate-400">Configure public payment destination</p>
                </div>
              </div>
              <button onClick={() => setShowAddWalletModal(false)} className="text-slate-400 hover:text-white p-1">✕</button>
            </div>

            <form onSubmit={handleAddWallet} className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Currency Code</label>
                  <input
                    type="text"
                    value={newWalletCurrency}
                    onChange={(e) => setNewWalletCurrency(e.target.value)}
                    placeholder="e.g. BITCOIN (BTC)"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5">Network</label>
                  <input
                    type="text"
                    value={newWalletNetwork}
                    onChange={(e) => setNewWalletNetwork(e.target.value)}
                    placeholder="e.g. BTC (Bitcoin)"
                    className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                      isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Public Blockchain Address</label>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder="e.g. bc1qv7nwcc70zrykgnkem845u2djy68p2u6yxk02ke"
                  className={`w-full rounded-xl px-4 py-2.5 font-mono border focus:outline-none focus:border-purple-500 ${
                    isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5">Minimum Deposit Limit ($)</label>
                <input
                  type="number"
                  value={newWalletMin}
                  onChange={(e) => setNewWalletMin(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2.5 border focus:outline-none focus:border-purple-500 ${
                    isDarkMode ? 'bg-[#161c28] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-700/30">
                <button
                  type="button"
                  onClick={() => setShowAddWalletModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingWallet}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {isAddingWallet ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Receiving Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
