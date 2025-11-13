import { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Rocket } from 'lucide-react';

import { clearCreatorAuth, getCreatorEmail } from '@/lib/creatorApi';

const links = [
  { label: 'Dashboard', to: '/creator/dashboard' },
  { label: 'Billing', to: '/creator/billing' },
];

export function CreatorNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useMemo(() => getCreatorEmail(), [location.key]);

  const handleLogout = () => {
    clearCreatorAuth();
    navigate('/creator/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0A0A0A]/95 backdrop-blur border-b border-white/20">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <div className="rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-1 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)]">
            Creator Studio
          </div>
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    'text-sm font-medium transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <NavLink
            to="/build"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD]"
          >
            <Rocket size={14} />
            Build Game
          </NavLink>
          {email && (
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {email}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-[#111111] px-3 py-1.5 text-xs font-medium text-white transition hover:border-white/30 hover:bg-[#1A1A1A]"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}


