import React, { useState } from 'react';
import { X, Copy, Check, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { UserProfile } from '../server/db.ts';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onDepositSuccess: (newBalance: number, message: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  user,
  onDepositSuccess
}) => {
  const [selectedAsset, setSelectedAsset] = useState('USDT (TRC20)');
  const [amount, setAmount] = useState('2500');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const cryptoAddresses: Record<string, { address: string; network: string; note: string }> = {
    'USDT (TRC20)': {
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      network: 'TRON (TRC-20)',
      note: 'Send only USDT TRC20 to this address. Instant 1-confirmation crediting.'
    },
    'Bitcoin (BTC)': {
      address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      network: 'Bitcoin Core',
      note: 'Send only BTC. Credited upon 2 network block confirmations.'
    },
    'Ethereum (ETH)': {
      address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      network: 'Ethereum (ERC-20)',
      note: 'Send only ETH or USDT ERC20 to this contract pool.'
    },
    'USDT (ERC20)': {
      address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
      network: 'Ethereum (ERC-20)',
      note: 'Send only USDT on Ethereum network.'
    }
  };

  const currentInfo = cryptoAddresses[selectedAsset] || cryptoAddresses['USDT (TRC20)'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      alert('Minimum deposit amount is $100.00');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          amount: numAmount,
          asset: selectedAsset,
          txHash: txHash.trim() || ('0x' + Math.random().toString(16).substring(2, 12))
        })
      });
      const data = await res.json();
      if (data.success) {
        onDepositSuccess(data.user.balance, data.message);
        onClose();
      } else {
        alert(data.error || 'Failed to process deposit');
      }
    } catch (err: any) {
      alert('Error connecting to Express backend: ' + err?.message);
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

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Deposit Funds</h3>
            <p className="text-xs text-slate-400">Add capital to your QUANTUM PLUS Industrial balance</p>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Deposit Currency
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(cryptoAddresses).map((asset) => (
                <button
                  type="button"
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedAsset === asset
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{asset}</span>
                  {selectedAsset === asset && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deposit Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="100"
                step="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-2.5 text-slate-100 text-sm font-mono focus:outline-none focus:border-cyan-500"
                placeholder="1000"
                required
              />
            </div>
            {/* Quick preset buttons */}
            <div className="flex gap-2 mt-2">
              {['500', '2500', '10000', '50000'].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
                >
                  ${Number(preset).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Address Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Network:</span>
              <span className="text-cyan-400 font-semibold">{currentInfo.network}</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-slate-200 truncate select-all">{currentInfo.address}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-slate-400 hover:text-cyan-400 shrink-0 transition"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">{currentInfo.note}</p>
          </div>

          {/* Transaction TXID Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Transaction Hash / TXID (Optional)
            </label>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="e.g. 0x8f2a...c4e9 (Auto-generated if empty)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming on Blockchain & Database...</span>
              ) : (
                <>
                  <span>Confirm & Credit ${Number(amount || 0).toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
