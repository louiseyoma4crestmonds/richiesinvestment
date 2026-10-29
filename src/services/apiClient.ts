import {
  PlatformStats,
  InvestmentPlan,
  MarketAsset,
  Transaction,
  Testimonial,
  UserProfile,
  UserInvestment,
  UserNotification,
  AdminDepositWallet
} from '../server/db.ts';

// Client API wrapper that calls the Express backend routes
export const apiClient = {
  async getStats(): Promise<PlatformStats> {
    const res = await fetch('/api/stats');
    const json = await res.json();
    return json.data;
  },

  async getPlans(): Promise<InvestmentPlan[]> {
    const res = await fetch('/api/plans');
    const json = await res.json();
    return json.data;
  },

  async getMarkets(): Promise<MarketAsset[]> {
    const res = await fetch('/api/markets');
    const json = await res.json();
    return json.data;
  },

  async getRecentTransactions(): Promise<Transaction[]> {
    const res = await fetch('/api/transactions/recent');
    const json = await res.json();
    return json.data;
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    const json = await res.json();
    return json.data;
  },

  async submitSupport(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async registerUser(data: {
    username: string;
    email: string;
    fullName: string;
    password: string;
    phone?: string;
    country?: string;
  }): Promise<{ success: boolean; user?: UserProfile; message?: string; error?: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async syncUser(uid: string, email?: string, displayName?: string): Promise<{
    user: UserProfile;
    investments: UserInvestment[];
    transactions: Transaction[];
  }> {
    const res = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, email, displayName })
    });
    return await res.json();
  },

  async deposit(data: { uid: string; amount: number; asset: string; txHash?: string }) {
    const res = await fetch('/api/user/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async invest(data: { uid: string; planId: string; amount: number; paymentSource?: 'balance' | 'crypto' }) {
    const res = await fetch('/api/user/invest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentSource: 'balance', ...data })
    });
    return await res.json();
  },

  async withdraw(data: { uid: string; amount: number; asset: string; destinationAddress: string }) {
    const res = await fetch('/api/user/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async claimProfit(data: { uid: string; investmentId: string }) {
    const res = await fetch('/api/user/claim-profit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateProfile(data: {
    uid: string;
    displayName?: string;
    cryptoWallets?: Record<string, string>;
    security?: Record<string, boolean>;
  }) {
    const res = await fetch('/api/user/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getNotifications(uid: string): Promise<UserNotification[]> {
    const res = await fetch(`/api/user/notifications?uid=${encodeURIComponent(uid)}`);
    const json = await res.json();
    return json.data || [];
  },

  async markNotificationRead(data: { uid: string; notifId?: string; markAll?: boolean }) {
    const res = await fetch('/api/user/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteNotification(data: { uid: string; notifId: string }) {
    const res = await fetch('/api/user/notifications/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async requestPasswordReset(identifier: string) {
    const res = await fetch('/api/user/password-reset-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    return await res.json();
  },

  async confirmPasswordReset(data: { identifier: string; newPassword: string; code?: string }) {
    const res = await fetch('/api/user/password-reset-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async changePassword(data: { uid: string; currentPassword?: string; newPassword: string }) {
    const res = await fetch('/api/user/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async transfer(data: { uid: string; recipientIdentifier: string; amount: number }) {
    const res = await fetch('/api/user/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getPerformance(uid?: string) {
    const query = uid ? `?uid=${encodeURIComponent(uid)}` : '';
    const res = await fetch(`/api/user/performance${query}`);
    return await res.json();
  },

  async updateProfileDetails(data: { uid: string; displayName?: string; username?: string; phone?: string; country?: string }) {
    const res = await fetch('/api/user/profile-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getPublicDepositWallets(): Promise<AdminDepositWallet[]> {
    const res = await fetch('/api/public/deposit-wallets');
    const json = await res.json();
    return json.data || json || [];
  },

  // Admin Methods
  async getAdminUsers(adminUid: string) {
    const res = await fetch('/api/admin/users', {
      headers: { 'x-admin-uid': adminUid }
    });
    return await res.json();
  },

  async createAdminUser(adminUid: string, payload: any) {
    const res = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': adminUid },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async updateAdminUser(adminUid: string, uid: string, payload: any) {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': adminUid },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async deleteAdminUser(adminUid: string, uid: string) {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(uid)}`, {
      method: 'DELETE',
      headers: { 'x-admin-uid': adminUid }
    });
    return await res.json();
  },

  async updateUserFinance(data: { adminUid: string; targetUid: string; balance?: number; profit?: number; bonus?: number; note?: string }) {
    const res = await fetch('/api/admin/update-user-finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': data.adminUid },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async manageUserInvestment(data: { adminUid: string; targetUid: string; action: 'add' | 'complete'; planId?: string; amount?: number; investmentId?: string }) {
    const res = await fetch('/api/admin/user-investment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': data.adminUid },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getAdminTransfers(adminUid: string) {
    const res = await fetch('/api/admin/transfers', {
      headers: { 'x-admin-uid': adminUid }
    });
    return await res.json();
  },

  async manageTransfer(data: { adminUid: string; transferId: string; action: 'approve' | 'reverse' }) {
    const res = await fetch('/api/admin/manage-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': data.adminUid },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async getAdminWallets(adminUid: string) {
    const res = await fetch('/api/admin/wallets', {
      headers: { 'x-admin-uid': adminUid }
    });
    return await res.json();
  },

  async addAdminWallet(data: { adminUid: string; currency: string; network: string; address: string; minDeposit?: number }) {
    const res = await fetch('/api/admin/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-uid': data.adminUid },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteAdminWallet(adminUid: string, id: string) {
    const res = await fetch(`/api/admin/wallets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'x-admin-uid': adminUid }
    });
    return await res.json();
  },

  async getChatConversations() {
    const res = await fetch('/api/chat/conversations');
    return await res.json();
  },

  async getChatMessages(conversationId?: string, userId?: string) {
    const params = new URLSearchParams();
    if (conversationId) params.append('conversationId', conversationId);
    if (userId) params.append('userId', userId);
    const res = await fetch(`/api/chat/messages?${params.toString()}`);
    return await res.json();
  },

  async sendChatMessage(payload: { userId?: string; userName?: string; userEmail?: string; text: string; conversationId?: string }) {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async replyChatMessage(payload: { conversationId: string; replyText: string; adminName?: string }) {
    const res = await fetch('/api/chat/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  },

  async markChatRead(conversationId: string) {
    const res = await fetch('/api/chat/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId })
    });
    return await res.json();
  }
};

