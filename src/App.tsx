import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LiveTicker } from './components/LiveTicker.tsx';
import { DepositModal } from './components/DepositModal.tsx';
import { InvestModal } from './components/InvestModal.tsx';
import { WithdrawModal } from './components/WithdrawModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { LiveChatWidget } from './components/LiveChatWidget.tsx';

import { HomeView } from './views/HomeView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { PlansView } from './views/PlansView.tsx';
import { MarketsView } from './views/MarketsView.tsx';
import { AffiliatesView } from './views/AffiliatesView.tsx';
import { FaqView } from './views/FaqView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { RegisterView } from './views/RegisterView.tsx';
import { SignInView } from './views/SignInView.tsx';

import { apiClient } from './services/apiClient.ts';
import {
  PlatformStats,
  InvestmentPlan,
  MarketAsset,
  Transaction,
  Testimonial,
  UserProfile,
  UserInvestment,
  seedStats,
  seedPlans,
  seedAssets,
  seedTransactions,
  seedTestimonials,
  seedUsers,
  seedUserInvestments
} from './server/db.ts';

import { Lock } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');

  // Core Dynamic Data State
  const [stats, setStats] = useState<PlatformStats>(seedStats);
  const [plans, setPlans] = useState<InvestmentPlan[]>(seedPlans);
  const [assets, setAssets] = useState<MarketAsset[]>(seedAssets);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(seedTransactions);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(seedTestimonials);

  // Active User Profile & Portfolio (strictly null when unauthenticated)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('quantum_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>(() => {
    if (currentUser?.uid && seedUserInvestments[currentUser.uid]) {
      return seedUserInvestments[currentUser.uid];
    }
    return [];
  });

  const [userTransactions, setUserTransactions] = useState<Transaction[]>(() => {
    if (currentUser?.uid) {
      return seedTransactions.filter(t => t.userId === currentUser.uid);
    }
    return [];
  });

  // Modals
  const [depositOpen, setDepositOpen] = useState(false);
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<string | undefined>(undefined);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync user from backend
  const syncUserData = useCallback(async (uid: string, email?: string, displayName?: string) => {
    try {
      const res = await apiClient.syncUser(uid, email, displayName);
      if (res && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('quantum_auth_user', JSON.stringify(res.user));
        if (res.investments) setUserInvestments(res.investments);
        if (res.transactions) setUserTransactions(res.transactions);
      }
    } catch (err) {
      console.warn('Sync fallback to local state:', err);
    }
  }, []);

  // Fetch Public Data
  const fetchPublicData = useCallback(async () => {
    try {
      const [fetchedStats, fetchedPlans, fetchedMarkets, fetchedTx, fetchedTestimonials] = await Promise.allSettled([
        apiClient.getStats(),
        apiClient.getPlans(),
        apiClient.getMarkets(),
        apiClient.getRecentTransactions(),
        apiClient.getTestimonials()
      ]);

      if (fetchedStats.status === 'fulfilled' && fetchedStats.value) setStats(fetchedStats.value);
      if (fetchedPlans.status === 'fulfilled' && fetchedPlans.value) setPlans(fetchedPlans.value);
      if (fetchedMarkets.status === 'fulfilled' && fetchedMarkets.value) setAssets(fetchedMarkets.value);
      if (fetchedTx.status === 'fulfilled' && fetchedTx.value) setRecentTransactions(fetchedTx.value);
      if (fetchedTestimonials.status === 'fulfilled' && fetchedTestimonials.value) setTestimonials(fetchedTestimonials.value);
    } catch (err) {
      console.warn('Could not refresh public data:', err);
    }
  }, []);

  // Initial mount & recurring polling for dynamic real-time updates
  useEffect(() => {
    fetchPublicData();
    if (currentUser?.uid) {
      syncUserData(currentUser.uid, currentUser.email, currentUser.displayName);
    }

    const interval = setInterval(() => {
      fetchPublicData();
    }, 6000);

    return () => clearInterval(interval);
  }, [fetchPublicData, syncUserData, currentUser?.uid, currentUser?.email, currentUser?.displayName]);

  // Session Termination Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('quantum_auth_user');
    sessionStorage.clear();
    setCurrentUser(null);
    setUserInvestments([]);
    setUserTransactions([]);
    setCurrentView('home');
    showToast('Session terminated. You have been securely signed out.');
  };

  // Handle plan select from anywhere
  const handleSelectPlanAndInvest = (planId: string) => {
    if (!currentUser) {
      showToast('Please sign in or create an account to start an investment.');
      setCurrentView('login');
      return;
    }
    setSelectedPlanForInvest(planId);
    setInvestOpen(true);
  };

  // Claim profit handler
  const handleClaimProfit = async (investmentId: string) => {
    if (!currentUser) return;
    try {
      const res = await apiClient.claimProfit({
        uid: currentUser.uid,
        investmentId
      });
      if (res.success) {
        setCurrentUser(res.user);
        localStorage.setItem('quantum_auth_user', JSON.stringify(res.user));
        setUserInvestments((prev) =>
          prev.map((inv) => (inv.id === res.investment.id ? res.investment : inv))
        );
        setUserTransactions((prev) => [res.transaction, ...prev]);
        showToast(res.message);
      } else {
        alert(res.error || 'Failed to claim yield');
      }
    } catch (err: any) {
      alert('Error claiming profit: ' + err?.message);
    }
  };

  // Update crypto wallets
  const handleUpdateWallets = async (wallets: Record<string, string>) => {
    if (!currentUser) return;
    try {
      const res = await apiClient.updateProfile({
        uid: currentUser.uid,
        cryptoWallets: wallets
      });
      if (res.success) {
        setCurrentUser(res.user);
        localStorage.setItem('quantum_auth_user', JSON.stringify(res.user));
        showToast('Wallet payout settings saved to database.');
      }
    } catch (err: any) {
      alert('Error updating wallets: ' + err?.message);
    }
  };

  // 1. Dedicated Full-Screen Register View matching uploaded screenshots
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-[#f3f4f8]">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
        <RegisterView
          onRegisterSuccess={(newUser) => {
            localStorage.setItem('quantum_auth_user', JSON.stringify(newUser));
            setCurrentUser(newUser);
            syncUserData(newUser.uid, newUser.email, newUser.displayName);
            showToast(`Registration complete! Welcome, ${newUser.displayName}.`);
            setCurrentView('dashboard');
          }}
          onGoToLogin={() => setCurrentView('login')}
          setCurrentView={setCurrentView}
        />
        <LiveChatWidget user={currentUser} />
      </div>
    );
  }

  // 2. Dedicated Full-Screen Sign In View matching styling
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#f3f4f8]">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
        <SignInView
          onLoginSuccess={(user) => {
            localStorage.setItem('quantum_auth_user', JSON.stringify(user));
            setCurrentUser(user);
            syncUserData(user.uid, user.email, user.displayName);
            showToast(`Welcome back, ${user.displayName}! Signed in successfully.`);
            setCurrentView('dashboard');
          }}
          onGoToRegister={() => setCurrentView('register')}
          setCurrentView={setCurrentView}
        />
        <LiveChatWidget user={currentUser} />
      </div>
    );
  }

  // 3. Dedicated Dashboard View (strictly guarded: unauthenticated users cannot access)
  if (currentView === 'dashboard') {
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-[#f3f4f8] flex items-center justify-center p-4">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-4 border border-slate-200 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Authentication Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unauthenticated users cannot access the investor portal. Please sign in or register to view your multi-asset balances and trading contracts.
            </p>
            <div className="flex gap-2.5 pt-3">
              <button
                onClick={() => setCurrentView('login')}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="flex-1 py-3 rounded-xl bg-[#484848] hover:bg-[#333333] text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium block mx-auto pt-1 cursor-pointer"
            >
              &larr; Return to Homepage
            </button>
          </div>
          <LiveChatWidget user={currentUser} />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        )}
        <DashboardView
          user={currentUser}
          investments={userInvestments}
          transactions={userTransactions}
          plans={plans}
          onOpenDeposit={() => setDepositOpen(true)}
          onOpenInvest={() => {
            setSelectedPlanForInvest(undefined);
            setInvestOpen(true);
          }}
          onOpenWithdraw={() => setWithdrawOpen(true)}
          onClaimProfit={handleClaimProfit}
          onRefreshUserData={() => syncUserData(currentUser.uid)}
          onUpdateWallets={handleUpdateWallets}
          setCurrentView={setCurrentView}
          onLogout={handleLogout}
        />

        <DepositModal
          isOpen={depositOpen}
          onClose={() => setDepositOpen(false)}
          user={currentUser}
          onDepositSuccess={(newBalance, msg) => {
            setCurrentUser((prev) => prev ? { ...prev, balance: newBalance } : null);
            showToast(msg);
            syncUserData(currentUser.uid);
          }}
        />

        <InvestModal
          isOpen={investOpen}
          onClose={() => setInvestOpen(false)}
          plans={plans}
          selectedPlanId={selectedPlanForInvest}
          user={currentUser}
          onInvestSuccess={(msg) => {
            showToast(msg);
            syncUserData(currentUser.uid);
          }}
          onOpenDeposit={() => setDepositOpen(true)}
        />

        <WithdrawModal
          isOpen={withdrawOpen}
          onClose={() => setWithdrawOpen(false)}
          user={currentUser}
          onWithdrawSuccess={(newBalance, msg) => {
            setCurrentUser((prev) => prev ? { ...prev, balance: newBalance } : null);
            showToast(msg);
            syncUserData(currentUser.uid);
          }}
        />

        <LiveChatWidget user={currentUser} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Real-time Market Ticker Marquee */}
      <LiveTicker assets={assets} recentTx={recentTransactions} />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={currentUser}
        onOpenAuth={() => setCurrentView('login')}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-500/80 text-cyan-200 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Views Router */}
      <main className="flex-grow">
        {(currentView === 'home' || currentView === 'services') && (
          <HomeView
            plans={plans}
            assets={assets}
            stats={stats}
            transactions={recentTransactions}
            testimonials={testimonials}
            onSelectPlanAndInvest={handleSelectPlanAndInvest}
            onOpenInvest={() => {
              if (!currentUser) {
                showToast('Please sign in to start investing.');
                setCurrentView('login');
                return;
              }
              setSelectedPlanForInvest(undefined);
              setInvestOpen(true);
            }}
            onOpenDeposit={() => {
              if (!currentUser) {
                showToast('Please sign in to make a deposit.');
                setCurrentView('login');
                return;
              }
              setDepositOpen(true);
            }}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'about' && (
          <AboutView
            setCurrentView={setCurrentView}
            onOpenInvest={() => {
              if (!currentUser) {
                showToast('Please sign in to start investing.');
                setCurrentView('login');
                return;
              }
              setSelectedPlanForInvest(undefined);
              setInvestOpen(true);
            }}
          />
        )}

        {currentView === 'plans' && (
          <PlansView
            plans={plans}
            onSelectPlanAndInvest={handleSelectPlanAndInvest}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'markets' && (
          <MarketsView
            assets={assets}
            onOpenInvest={() => {
              if (!currentUser) {
                showToast('Please sign in to start investing.');
                setCurrentView('login');
                return;
              }
              setSelectedPlanForInvest(undefined);
              setInvestOpen(true);
            }}
          />
        )}

        {currentView === 'affiliates' && (
          <AffiliatesView
            user={currentUser}
            setCurrentView={setCurrentView}
            onOpenAuth={() => setCurrentView('register')}
          />
        )}

        {currentView === 'faq' && <FaqView setCurrentView={setCurrentView} />}

        {currentView === 'contact' && <ContactView />}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            user={currentUser}
            investments={userInvestments}
            transactions={userTransactions}
            plans={plans}
            onOpenDeposit={() => setDepositOpen(true)}
            onOpenInvest={() => {
              setSelectedPlanForInvest(undefined);
              setInvestOpen(true);
            }}
            onOpenWithdraw={() => setWithdrawOpen(true)}
            onClaimProfit={handleClaimProfit}
            onRefreshUserData={() => syncUserData(currentUser.uid)}
            onUpdateWallets={handleUpdateWallets}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* 4. Global Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* 5. Interactive Modals (strictly gated for authenticated users) */}
      {depositOpen && currentUser && (
        <DepositModal
          isOpen={depositOpen}
          onClose={() => setDepositOpen(false)}
          user={currentUser}
          onDepositSuccess={(newBalance, msg) => {
            setCurrentUser((prev) => prev ? { ...prev, balance: newBalance } : null);
            showToast(msg);
            syncUserData(currentUser.uid);
          }}
        />
      )}

      {investOpen && currentUser && (
        <InvestModal
          isOpen={investOpen}
          onClose={() => setInvestOpen(false)}
          plans={plans}
          selectedPlanId={selectedPlanForInvest}
          user={currentUser}
          onInvestSuccess={(msg) => {
            showToast(msg);
            syncUserData(currentUser.uid);
            setCurrentView('dashboard');
          }}
          onOpenDeposit={() => setDepositOpen(true)}
        />
      )}

      {withdrawOpen && currentUser && (
        <WithdrawModal
          isOpen={withdrawOpen}
          onClose={() => setWithdrawOpen(false)}
          user={currentUser}
          onWithdrawSuccess={(newBalance, msg) => {
            setCurrentUser((prev) => prev ? { ...prev, balance: newBalance } : null);
            showToast(msg);
            syncUserData(currentUser.uid);
          }}
        />
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={(uid, email, displayName) => {
          syncUserData(uid, email, displayName);
          showToast(`Welcome, ${displayName}! Signed into QUANTUM PLUS Portal.`);
          setCurrentView('dashboard');
        }}
      />

      {/* Floating Chat Widget connecting regular users to admin */}
      <LiveChatWidget user={currentUser} />
    </div>
  );
}
