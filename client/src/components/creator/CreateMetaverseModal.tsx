import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

interface CreateMetaverseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; kind: 'TWO_D' | 'THREE_D'; region: 'ASIA' | 'EU' | 'US' }) => Promise<void>;
  loading?: boolean;
}

export function CreateMetaverseModal({ open, onClose, onSubmit, loading }: CreateMetaverseModalProps) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'TWO_D' | 'THREE_D'>('THREE_D');
  const [region, setRegion] = useState<'ASIA' | 'EU' | 'US'>('ASIA');

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await onSubmit({ name: name.trim(), kind, region });
    setName('');
    setKind('THREE_D');
    setRegion('ASIA');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#111111] p-8 shadow-[0_0_55px_rgba(59,130,246,0.5)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-white">Create New Metaverse</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Metaverse Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Awesome World"
              className="w-full rounded-xl border border-white/20 bg-[#1A1A1A] px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-400/60 focus:border-2"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setKind('THREE_D')}
                disabled={loading}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  kind === 'THREE_D'
                    ? 'border-blue-400/70 bg-blue-500/20 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                3D
              </button>
              <button
                type="button"
                onClick={() => setKind('TWO_D')}
                disabled={loading}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  kind === 'TWO_D'
                    ? 'border-blue-400/70 bg-blue-500/20 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                2D
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Region
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['ASIA', 'EU', 'US'] as const).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setRegion(reg)}
                  disabled={loading}
                  className={`rounded-xl border-2 px-4 py-2 text-xs font-semibold transition ${
                    region === reg
                      ? 'border-blue-400/70 bg-blue-500/20 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'border-white/20 bg-[#1A1A1A] text-gray-300 hover:border-white/30 hover:bg-[#222222]'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/20 bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-gray-300 transition hover:border-white/30 hover:bg-[#222222] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Metaverse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

