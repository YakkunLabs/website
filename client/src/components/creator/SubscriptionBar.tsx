import type { Subscription } from '@/lib/creatorApi';

interface SubscriptionBarProps {
  subscription: Subscription;
}

export function SubscriptionBar({ subscription }: SubscriptionBarProps) {
  const percentUsed = Math.min((subscription.usedHours / subscription.monthlyHours) * 100, 100);
  const hoursRemaining = Math.max(subscription.monthlyHours - subscription.usedHours, 0);

  return (
    <div className="rounded-3xl border border-white/20 bg-[#111111] p-6 shadow-[0_0_45px_rgba(59,130,246,0.3)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Current Plan</p>
          <h3 className="text-2xl font-semibold text-white">{subscription.plan}</h3>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-gray-400">Next Billing</p>
          <p className="text-sm text-white">
            {new Date(subscription.nextBilling).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Usage</span>
          <span>
            {subscription.usedHours} / {subscription.monthlyHours} hrs
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] transition-all"
            style={{ width: `${percentUsed}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-gray-400">
          {hoursRemaining} hours remaining • Resets{' '}
          {new Date(subscription.resetDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}


