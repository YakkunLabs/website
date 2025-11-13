import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Activity, CloudLightning, Compass, Play, RefreshCcw, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  Metaverse,
  clearCreatorAuth,
  controlMetaverse,
  fetchMetaverse,
} from '@/lib/creatorApi';
import { CreatorNav } from '@/components/creator/CreatorNav';
import { StatusChip } from '@/components/creator/StatusChip';

export function CreatorDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [metaverse, setMetaverse] = useState<Metaverse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const actionLabels: Record<'start' | 'stop' | 'restart', string> = {
    start: 'started',
    stop: 'stopped',
    restart: 'restarted',
  };
  const kindLabel = useMemo(() => {
    if (!metaverse) return '';
    return metaverse.kind === 'TWO_D' ? '2D' : '3D';
  }, [metaverse]);

  const uptimeHours = useMemo(() => (metaverse ? Math.round(metaverse.uptimeMinutes / 60) : 0), [metaverse]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchMetaverse(id);
      setMetaverse(data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Metaverse not found');
      navigate('/creator/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    if (!id) return;
    setActionLoading(true);
    try {
      const updated = await controlMetaverse(id, action);
      setMetaverse(updated);
      toast.success(`Metaverse ${actionLabels[action]}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Unable to update metaverse');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.2),_transparent_45%)]" />
      <CreatorNav />
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
        <Link
          to="/creator/dashboard"
          className="text-xs font-medium text-blue-300 transition hover:text-blue-200"
        >
          ← Back to dashboard
        </Link>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-white/20 bg-[#111111] p-12 text-center text-sm text-gray-300">
            Loading metaverse...
          </div>
        ) : metaverse ? (
          <div className="mt-10 space-y-8">
            <section className="rounded-3xl border border-white/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(59,130,246,0.3)] backdrop-blur">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
                    {kindLabel} • {metaverse.region}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold text-white">{metaverse.name}</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Manage runtime controls for this experience, review live telemetry, and deploy
                    new builds without downtime.
                  </p>
                </div>
                <StatusChip status={metaverse.status} />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                    <Activity size={14} />
                    Runtime Snapshot
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Players Online</p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {metaverse.playersOnline}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Hours Used</p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {metaverse.hoursUsed} hrs
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Uptime</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{uptimeHours} hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Version</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{metaverse.version}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                    <Compass size={14} />
                    Region & Scaling
                  </div>
                  <p className="mt-4 text-sm text-gray-200">
                    Regions are optimized for latency & scaling. Switch between clusters directly
                    from the billing page and orchestrate blue/green deployments.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      Region: {metaverse.region}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1">
                      Kind: {kindLabel}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(96,165,250,0.3)] backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Runtime Controls</h2>
                  <p className="text-sm text-gray-300">
                    All actions are streamed through our control plane. Actions are idempotent and
                    safe to retry.
                  </p>
                </div>
                <CloudLightning className="hidden text-blue-300 md:block" size={28} />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleAction('start')}
                  disabled={actionLoading}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-5 py-4 text-left text-sm font-medium text-white shadow-[0_0_35px_rgba(96,165,250,0.25)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-60"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-100/70">Start</p>
                    <p className="mt-1 text-sm text-white">Boot runtime and attach nodes</p>
                  </div>
                  <Play size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('stop')}
                  disabled={actionLoading}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111826] px-5 py-4 text-left text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Stop</p>
                    <p className="mt-1 text-sm text-gray-200">Graceful shutdown and archive logs</p>
                  </div>
                  <StopCircle size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => handleAction('restart')}
                  disabled={actionLoading}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1f2940] px-5 py-4 text-left text-sm font-medium text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-60"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Restart</p>
                    <p className="mt-1 text-sm text-gray-200">Cycle processes & refresh state</p>
                  </div>
                  <RefreshCcw size={20} />
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
}


