import { useState } from 'react';
import { Play, StopCircle, RefreshCcw, Trash2, Users, Clock3, Gauge } from 'lucide-react';

import type { Metaverse } from '@/lib/creatorApi';
import { ConfirmModal } from './ConfirmModal';
import { StatusChip } from './StatusChip';

interface MetaverseCardProps {
  data: Metaverse;
  onAction: (id: string, action: 'start' | 'stop' | 'restart') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MetaverseCard({ data, onAction, onDelete }: MetaverseCardProps) {
  const [loadingAction, setLoadingAction] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const kindLabel = data.kind === 'TWO_D' ? '2D' : '3D';

  const handle = async (action: 'start' | 'stop' | 'restart') => {
    setLoadingAction(true);
    try {
      await onAction(data.id, action);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await onDelete(data.id);
    } finally {
      setLoadingAction(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="relative flex flex-col rounded-3xl border border-white/20 bg-[#111111] p-6 shadow-[0_0_55px_rgba(59,130,246,0.3)] transition hover:border-blue-500/30 hover:shadow-[0_0_65px_rgba(96,165,250,0.4)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          <p className="text-xs uppercase tracking-wider text-gray-400">
            {kindLabel} • {data.region}
          </p>
        </div>
        <StatusChip status={data.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-gray-300">
          <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
            <Users size={12} />
            Online
          </div>
          <p className="mt-1 text-base font-semibold text-white">{data.playersOnline}</p>
        </div>
          <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
            <Clock3 size={12} />
            Uptime
          </div>
          <p className="mt-1 text-base font-semibold text-slate-100">
            {Math.round(data.uptimeMinutes / 60)}h
          </p>
        </div>
          <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
            <Gauge size={12} />
            Hours
          </div>
          <p className="mt-1 text-base font-semibold text-slate-100">{data.hoursUsed}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <button
          type="button"
          onClick={() => handle('start')}
          disabled={loadingAction}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-3 py-2 font-medium text-white shadow-[0_0_35px_rgba(96,165,250,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-60"
        >
          <Play size={16} />
          Start
        </button>
        <button
          type="button"
          onClick={() => handle('stop')}
          disabled={loadingAction}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#1A1A1A] px-3 py-2 font-medium text-gray-200 transition hover:border-white/30 hover:bg-[#222222] hover:text-white disabled:opacity-60"
        >
          <StopCircle size={16} />
          Stop
        </button>
        <button
          type="button"
          onClick={() => handle('restart')}
          disabled={loadingAction}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#1f2940] px-3 py-2 font-medium text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-60"
        >
          <RefreshCcw size={16} />
          Restart
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={loadingAction}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-900/40 px-3 py-2 font-medium text-red-200 transition hover:border-red-400/60 hover:text-red-100 disabled:opacity-60"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete metaverse?"
        description="This will permanently remove the world and its runtime metrics."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={loadingAction}
      />
    </div>
  );
}


