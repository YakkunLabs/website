import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
  clearCreatorAuth,
  getCreatorToken,
  loginCreator,
  registerCreator,
} from '@/lib/creatorApi';

type AuthMode = 'login' | 'register';

interface CreatorLoginProps {
  defaultMode?: AuthMode;
}

export function CreatorLogin({ defaultMode = 'login' }: CreatorLoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = useMemo<AuthMode>(() => defaultMode, [defaultMode]);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('demo@gg.play');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getCreatorToken();
    if (token) {
      navigate('/creator/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerCreator({ email, password });
        toast.success('Account created! Welcome to YakkunLabs Creator. You can now build your game!');
      } else {
        await loginCreator({ email, password });
        toast.success('Welcome back Creator 👾');
      }
      
      // Ensure token is saved before navigation
      const token = getCreatorToken();
      if (!token) {
        toast.error('Authentication failed. Please try again.');
        setLoading(false);
        return;
      }
      
      const redirectTo =
        ((location.state as { from?: { pathname: string } } | undefined)?.from?.pathname) ??
        '/creator/dashboard';
      
      // Small delay to ensure ProtectedRoute can detect the token change
      // The event is already fired by persistAuth, but we give React a moment to process it
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      // Navigate to dashboard - use window.location as fallback if navigate doesn't work
      try {
        navigate(redirectTo, { replace: true });
        // Fallback: if navigation doesn't happen after a moment, use window.location
        setTimeout(() => {
          if (window.location.pathname !== redirectTo) {
            window.location.href = redirectTo;
          }
        }, 200);
      } catch (navError) {
        // If navigate fails, use window.location directly
        window.location.href = redirectTo;
      }
    } catch (error) {
      clearCreatorAuth();
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ??
          (mode === 'register'
            ? 'Unable to create account. Please try again.'
            : 'Unable to authenticate. Check credentials and try again.');
        toast.error(message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.4),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.3),_transparent_45%)]" />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/20 bg-[#111111] p-10 backdrop-blur shadow-[0_0_55px_rgba(59,130,246,0.3)]">
        <div className="mb-6 text-xs uppercase tracking-[0.4em] text-gray-400">
          <div className="flex items-center justify-between">
            <span>YakkunLabs Play</span>
            <span>Creator Access</span>
          </div>
        </div>
        <div className="mb-6 flex rounded-full border border-white/20 bg-[#1A1A1A] p-1">
          {(['login', 'register'] as AuthMode[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={[
                'flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition',
                mode === option
                  ? 'bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white shadow-[0_0_25px_rgba(96,165,250,0.35)]'
                  : 'text-gray-400 hover:text-gray-200',
              ].join(' ')}
            >
              {option === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-white">
            {mode === 'login' ? 'Creator Dashboard' : 'Create Your Creator Account'}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            {mode === 'login'
              ? 'Sign in to orchestrate your metaverse runtime and billing usage.'
              : 'Spin up your creator portal in seconds. We preload demo data so you can explore instantly.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete={mode === 'login' ? 'email' : 'new-email'}
              className="mt-1 w-full rounded-xl border border-white/20 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/60 focus:border-2"
              placeholder="creator@studio.gg"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="mt-1 w-full rounded-xl border border-white/20 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/60 focus:border-2"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_45px_rgba(96,165,250,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-60"
          >
            {loading ? 'Working...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center text-xs text-gray-400">
          <p>
            {mode === 'login'
              ? 'New here? Switch to Sign Up above to create your studio account.'
              : 'Already launched a world? Switch back to Login to jump into your dashboard.'}
          </p>
          <p className="text-[11px] text-gray-400">
            Demo access:             <span className="font-semibold text-white">demo@gg.play</span> /{' '}
            <span className="font-semibold text-white">demo123</span>
          </p>
        </div>
      </div>
    </div>
  );
}


