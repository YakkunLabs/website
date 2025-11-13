import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
  Metaverse,
  Subscription,
  clearCreatorAuth,
  controlMetaverse,
  createMetaverse,
  deleteMetaverse,
  fetchMetaverses,
  fetchSubscription,
} from '@/lib/creatorApi';
import { fetchProjects, type Project } from '@/lib/api';
import { Rocket } from 'lucide-react';

import { CreatorNav } from '@/components/creator/CreatorNav';
import { CreateMetaverseModal } from '@/components/creator/CreateMetaverseModal';
import { MetaverseCard } from '@/components/creator/MetaverseCard';
import { ProjectCard } from '@/components/creator/ProjectCard';
import { SubscriptionBar } from '@/components/creator/SubscriptionBar';
import { Link } from 'react-router-dom';

export function CreatorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [metaverses, setMetaverses] = useState<Metaverse[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingMetaverse, setCreatingMetaverse] = useState(false);
  const actionLabels: Record<'start' | 'stop' | 'restart', string> = {
    start: 'started',
    stop: 'stopped',
    restart: 'restarted',
  };

  const loadMetaverses = async () => {
    setLoading(true);
    try {
      const data = await fetchMetaverses();
      setMetaverses(data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true, state: { from: { pathname: '/creator/dashboard' } } });
        return;
      }
      toast.error('Failed to load metaverses');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      // Don't show error for projects, just log it
      console.error('Failed to load projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadSubscription = async () => {
    setSubscriptionLoading(true);
    try {
      const data = await fetchSubscription();
      setSubscription(data);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      // Don't show error for subscription, just log it
      console.error('Failed to load subscription:', error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  useEffect(() => {
    void loadMetaverses();
    void loadProjects();
    void loadSubscription();
  }, []);

  // Refresh projects when navigating to dashboard (e.g., after building)
  useEffect(() => {
    void loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const handleAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    try {
      await controlMetaverse(id, action);
      toast.success(`Metaverse ${actionLabels[action]}`);
      // Reload after a short delay to see the transition state
      setTimeout(() => {
        void loadMetaverses();
      }, 500);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          clearCreatorAuth();
          navigate('/creator/login', { replace: true });
          return;
        }
        // Show specific error message from server
        const errorMessage = (error.response?.data as { message?: string })?.message || 
          `Unable to ${action} metaverse. ${error.response?.status === 400 ? 'Invalid state transition.' : ''}`;
        toast.error(errorMessage);
      } else {
        toast.error('Unable to update metaverse. Please try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMetaverse(id);
      toast.success('Metaverse deleted');
      await loadMetaverses();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        clearCreatorAuth();
        navigate('/creator/login', { replace: true });
        return;
      }
      toast.error('Unable to delete metaverse');
    }
  };

  const handleCreateMetaverse = async (data: { name: string; kind: 'TWO_D' | 'THREE_D'; region: 'ASIA' | 'EU' | 'US' }) => {
    setCreatingMetaverse(true);
    try {
      await createMetaverse(data);
      toast.success('Metaverse created successfully');
      setShowCreateModal(false);
      await loadMetaverses();
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = (error.response?.data as { message?: string })?.message || 'Failed to create metaverse';
        toast.error(errorMessage);
      } else {
        toast.error('Unable to create metaverse');
      }
    } finally {
      setCreatingMetaverse(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.25),_transparent_50%)]" />
      <CreatorNav />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">YakkunLabs Play</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Creator Dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-gray-300">
              Build your game, then manage and monitor your metaverses. Upload assets, create experiences, and launch your world.
            </p>
          </div>
          <Link
            to="/build"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(59,130,246,0.4)] transition hover:from-[#2563EB] hover:to-[#93C5FD] hover:shadow-[0_0_45px_rgba(96,165,250,0.5)]"
          >
            <Rocket size={18} />
            Build Your Game
          </Link>
        </div>

        {!subscriptionLoading && subscription && (
          <div className="mt-8">
            <SubscriptionBar subscription={subscription} />
            <div className="mt-4 flex gap-3">
              <Link
                to="/creator/billing"
                className="rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD]"
              >
                Upgrade Plan
              </Link>
              <Link
                to="/creator/billing"
                className="rounded-xl border border-white/20 bg-[#111111] px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-white/30 hover:bg-[#1A1A1A] hover:text-white"
              >
                Buy Hours
              </Link>
            </div>
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white">My Projects</h2>
          {projectsLoading ? (
            <div className="mt-6 rounded-3xl border border-white/20 bg-[#111111] p-8 text-center text-sm text-gray-300">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-[#111111] p-12 text-center">
              <div className="mx-auto max-w-md">
                <Rocket className="mx-auto mb-4 text-slate-500" size={48} />
                <p className="mb-2 text-base font-semibold text-gray-300">No projects yet</p>
                <p className="mb-6 text-sm text-gray-400">
                  Build your first game project. Upload assets, configure your world, and create your experience.
                </p>
                <Link
                  to="/build"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(124,58,237,0.4)] transition hover:from-[#8b5cf6] hover:to-[#22d3ee]"
                >
                  <Rocket size={16} />
                  Start Building
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => {
                    void loadProjects();
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Metaverses</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-4 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] transition hover:from-[#8b5cf6] hover:to-[#22d3ee]"
            >
              <Rocket size={16} />
              Create Metaverse
            </button>
          </div>
          {loading ? (
            <div className="mt-6 rounded-3xl border border-white/20 bg-[#111111] p-8 text-center text-sm text-gray-300">
              Loading metaverses...
            </div>
          ) : metaverses.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-[#111111] p-12 text-center">
              <div className="mx-auto max-w-md">
                <Rocket className="mx-auto mb-4 text-slate-500" size={48} />
                <p className="mb-2 text-base font-semibold text-gray-300">No metaverses yet</p>
                <p className="mb-6 text-sm text-gray-400">
                  Create a metaverse to deploy your projects, manage runtime, monitor usage, and control instances.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(124,58,237,0.4)] transition hover:from-[#8b5cf6] hover:to-[#22d3ee]"
                >
                  <Rocket size={16} />
                  Create Your First Metaverse
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {metaverses.map((metaverse) => (
                <MetaverseCard
                  key={metaverse.id}
                  data={metaverse}
                  onAction={handleAction}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>

        <CreateMetaverseModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMetaverse}
          loading={creatingMetaverse}
        />
      </main>
    </div>
  );
}


