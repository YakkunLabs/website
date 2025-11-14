import { Link } from 'react-router-dom';
import { Layers3, Mail, Rocket, TimerReset } from 'lucide-react';

import { GridPattern } from '@/components/backgrounds/GridPattern';
import { getCreatorToken } from '@/lib/creatorApi';

export function Landing() {
  const isLoggedIn = getCreatorToken() !== null;
  const highlights = [
    {
      icon: Rocket,
      title: 'Launch faster',
      description: 'Upload, preview, and build in minutes with zero boilerplate setup.',
    },
    {
      icon: Layers3,
      title: '3D ready',
      description: 'GLB/GLTF previews with orbit controls and animation playback out of the box.',
    },
    {
      icon: TimerReset,
      title: 'Automated builds',
      description: 'Kick off pipeline simulations and monitor progress with friendly toasts.',
    },
  ];

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#0A0A0A] px-6 pb-24 pt-12 sm:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.2),_transparent_45%)]" />
      <GradientOrbs />
      <GridPattern density="normal" className="opacity-30" />
      <div className="relative z-10 mx-auto mb-12 flex w-full max-w-5xl items-center justify-end text-sm text-[#E5E7EB]/80">
        <nav className="flex items-center gap-3">
          <Link
            to={isLoggedIn ? '/creator/dashboard' : '/creator/login'}
            className="relative z-10 h-2 w-2 rounded-full bg-white/20 transition hover:bg-white/40 hover:scale-125"
            title=""
          />
        </nav>
      </div>
      <header className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <div className="flex flex-col items-center">
          <span className="rounded-full border border-white/20 bg-[#111111] px-4 py-1 text-xs uppercase tracking-[0.4em] text-white backdrop-blur">
            Build Faster
          </span>
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="bg-primary-gradient bg-clip-text text-transparent">
              YakkunLabs
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-xl text-[#E5E7EB]/80 sm:text-2xl md:text-3xl">
            Launch your metaverse/game in{' '}
            <span className="bg-primary-gradient bg-clip-text font-semibold text-transparent">
              No time
            </span>
            .
          </p>
          <div className="relative z-10 mt-10 flex justify-center">
            <button
              disabled={true}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-transparent px-8 py-3 h-12 text-base font-medium text-gray-400 opacity-50 cursor-not-allowed shadow-none"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Coming Soon
            </button>
          </div>
        </div>
      </header>
      <section className="relative z-10 mx-auto mt-16 w-full max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative z-10 rounded-2xl border border-white/20 bg-[#111111] p-5 shadow-[0_18px_45px_-35px_rgba(59,130,246,0.4)] backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-500/30"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-gradient/40 text-white transition group-hover:bg-primary-gradient">
                  <Icon className="h-5 w-5 animate-pulse" />
                </div>
                <p className="text-base font-semibold text-white">{title}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative z-10 mx-auto mt-16 w-full max-w-5xl">
        <div className="flex items-center justify-center gap-3 rounded-full bg-[#111111] px-8 py-4 shadow-[0_18px_45px_-35px_rgba(59,130,246,0.4)] backdrop-blur">
          <Mail className="h-5 w-5 text-primary" />
          <span className="text-base font-medium text-white">Contact Us:</span>
          <a
            href="mailto:kasun@yakkunlabs.com"
            className="text-base text-[#E5E7EB]/80 transition hover:text-primary hover:underline"
          >
            kasun@yakkunlabs.com
          </a>
        </div>
      </section>
    </div>
  );
}

function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-24 h-72 w-72 animate-float rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.5),_transparent_60%)] blur-3xl" />
        <div className="absolute right-0 top-60 h-80 w-80 animate-float rounded-full bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.45),_transparent_60%)] blur-3xl" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(59,130,246,0.5),rgba(0,0,0,0))]" />
    </>
  );
}

