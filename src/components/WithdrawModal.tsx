import React, { useState } from 'react';
import { X, ArrowDownRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../server/db.ts';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onWithdrawSuccess: (newBalance: number, message: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  user,
  onWithdrawSuccess
}) => {
  const [selectedAsset, setSelectedAsset] = useState('USDT (TRC20)');
  const [amount, setAmount] = useState('1500');
  const [destinationAddress, setDestinationAddress] = useState(user.cryptoWallets?.usdtTrx || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const isVip = user.totalInvested >= 100000;
  const networkFee = isVip ? 0.00 : selectedAsset.includes('BTC') ? 5.00 : selectedAsset.includes('ETH') ? 8.00 : 1.00;
  const netReceived = Math.max(0, numAmount - networkFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount < 50) {
      setErrorMsg('Minimum withdrawal amount is $50.00');
      return;
    }

    if (numAmount > user.balance) {
      setErrorMsg(`Insufficient balance. Maximum available is $${user.balance.toFixed(2)}`);
      return;
    }

    if (!destinationAddress || destinationAddress.trim().length < 10) {
      setErrorMsg('Please enter a valid crypto destination wallet address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          amount: numAmount,
          asset: selectedAsset,
          destinationAddress: destinationAddress.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        onWithdrawSuccess(data.user.balance, data.message);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to process withdrawal');
      }
    } catch (err: any) {
      setErrorMsg('Network error: ' + err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Withdraw Funds</h3>
            <p className="text-xs text-slate-400">Instant payout from account balance</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current balance card */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Available for Withdrawal:</span>
            <span className="text-base font-bold text-cyan-400 font-mono">
              ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payout Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['USDT (TRC20)', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT (ERC20)'].map((asset) => (
                <button
                  type="button"
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition ${
                    selectedAsset === asset
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300'
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Withdrawal Amount (USD)
              </label>
              <button
                type="button"
                onClick={() => setAmount(String(Math.floor(user.balance)))}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Max Available
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="50"
                max={user.balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Destination Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your {selectedAsset} Receiving Wallet Address
            </label>
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="Enter your external crypto address"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Summary Box */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Amount:</span>
              <span className="text-slate-200 font-mono">${numAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Network Settlement Fee:</span>
              <span className="text-slate-200 font-mono">
                {networkFee === 0 ? <span className="text-emerald-400">Free (VIP Tier)</span> : `$${networkFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between font-semibold">
              <span className="text-slate-200">Net Dispatched:</span>
              <span className="text-emerald-400 font-mono text-sm">${netReceived.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || user.balance < 50}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Signing Blockchain Transaction...</span>
            ) : (
              <span>Confirm Instant Withdrawal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
