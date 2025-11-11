import { Link } from 'react-router-dom';
import { ArrowRight, Layers3, Rocket, TimerReset } from 'lucide-react';

import { GridPattern } from '@/components/backgrounds/GridPattern';
import { Button } from '@/components/ui/button';

export function Landing() {
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
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background px-6 py-24 sm:px-16">
      <GradientOrbs />
      <GridPattern density="normal" className="opacity-40" />
      <header className="mx-auto w-full max-w-5xl text-center">
        <div className="flex flex-col items-center">
          <span className="rounded-full border border-border bg-surface/70 px-4 py-1 text-xs uppercase tracking-[0.4em] text-muted-foreground backdrop-blur">
            Build Faster
          </span>
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="bg-primary-gradient bg-clip-text text-transparent">
              YakkunLabs Play
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#E5E7EB]/80 sm:text-xl">
            Launch your metaverse/game in{' '}
            <span className="bg-primary-gradient bg-clip-text font-semibold text-transparent">
              No time
            </span>
            .
          </p>
          <Button
            asChild
            className="mt-10 h-12 px-8 text-base shadow-glow transition hover:shadow-[0_0_40px_rgba(109,40,217,0.65)]"
          >
            <Link to="/build" className="inline-flex items-center gap-2">
              Build Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>
      <section className="mx-auto mt-16 w-full max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-2xl border border-border/70 bg-surface/80 p-5 shadow-[0_20px_60px_-35px_rgba(6,182,212,0.55)] backdrop-blur transition hover:-translate-y-1 hover:border-primary/70"
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
    </div>
  );
}

function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-24 h-72 w-72 animate-float rounded-full bg-[radial-gradient(circle_at_center,_rgba(109,40,217,0.5),_transparent_60%)] blur-3xl" />
        <div className="absolute right-0 top-60 h-80 w-80 animate-float rounded-full bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.45),_transparent_60%)] blur-3xl" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(120%_80%_at_50%_0%,rgba(109,40,217,0.5),rgba(17,24,39,0))]" />
    </>
  );
}

