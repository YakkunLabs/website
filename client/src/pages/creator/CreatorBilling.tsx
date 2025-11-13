import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
  Subscription,
  buySubscriptionHours,
  clearCreatorAuth,
  fetchSubscription,
  upgradeSubscription,
} from '@/lib/creatorApi';
import { CreatorNav } from '@/components/creator/CreatorNav';
import { SubscriptionBar } from '@/components/creator/SubscriptionBar';

const plans: Array<{ id: Subscription['plan']; description: string }> = [
  { id: 'INDIE', description: 'For solo creators experimenting with worlds.' },
  { id: 'PRO', description: 'Studios running seasonal live ops events.' },
  { id: 'STUDIO', description: 'High concurrency events and eSports activations.' },
];

export function CreatorBilling() {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Subscription['plan']>('INDIE');
  const [customHours, setCustomHours] = useState(50);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSubscription();
      setSubscription(data);
      setSelectedPlan(data.plan);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Unable to load subscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleUpgrade = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subscription) return;
    setUpgradeLoading(true);
    try {
      const updated = await upgradeSubscription(selectedPlan);
      setSubscription(updated);
      toast.success(`Plan upgraded to ${selectedPlan}`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Upgrade failed');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleTopUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subscription) return;
    setTopUpLoading(true);
    try {
      const updated = await buySubscriptionHours(customHours);
      setSubscription(updated);
      toast.success(`Added ${customHours} hours`);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Top-up failed');
    } finally {
      setTopUpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.2),_transparent_45%)]" />
      <CreatorNav />
      <main className="mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
        <header>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">Billing Center</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Subscription & Capacity</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Scale your runtime hours and players without punching through guardrails. Plans flex
            based on session concurrency and includes built-in observability.
          </p>
        </header>

        {loading || !subscription ? (
          <div className="mt-10 rounded-3xl border border-white/20 bg-[#111111] p-12 text-center text-sm text-gray-300">
            {loading ? 'Loading subscription...' : 'Subscription not found'}
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            <SubscriptionBar subscription={subscription} />

            <section className="rounded-3xl border border-white/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(96,165,250,0.3)] backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Upgrade Plan</h2>
              <p className="mt-2 text-sm text-gray-300">
                Switch plans instantly. Upgrades are prorated against your next billing cycle.
              </p>
              <form onSubmit={handleUpgrade} className="mt-6 grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={[
                      'flex cursor-pointer flex-col gap-2 rounded-2xl border p-5 transition',
                      selectedPlan === plan.id
                        ? 'border-blue-400/60 bg-blue-400/10 text-white'
                        : 'border-white/20 bg-[#1A1A1A] text-white hover:border-white/30 hover:bg-[#222222]',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={selectedPlan === plan.id}
                      onChange={() => setSelectedPlan(plan.id)}
                      className="hidden"
                    />
                    <div className="text-sm font-semibold">{plan.id}</div>
                    <p className="text-xs text-gray-400">{plan.description}</p>
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={upgradeLoading}
                  className="md:col-span-3 flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_45px_rgba(96,165,250,0.25)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-60"
                >
                  {upgradeLoading ? 'Upgrading...' : 'Update Plan'}
                </button>
              </form>
            </section>

            <section className="rounded-3xl border border-white/20 bg-[#111111] p-8 shadow-[0_0_45px_rgba(59,130,246,0.3)] backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Top-up Hours</h2>
              <p className="mt-2 text-sm text-gray-300">
                Add emergency runtime capacity for big community events or launches.
              </p>
              <form onSubmit={handleTopUp} className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wide text-gray-400">
                    Hours to add
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={customHours}
                    onChange={(event) => setCustomHours(Number(event.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/60 focus:border-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={topUpLoading}
                  className="rounded-xl bg-[#111826] px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-[#1c2438] disabled:opacity-60 md:w-auto"
                >
                  {topUpLoading ? 'Processing...' : 'Add Hours'}
                </button>
              </form>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}


