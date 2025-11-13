import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, File, Image, Package, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteProject, type Project } from '@/lib/api';
import { ConfirmModal } from './ConfirmModal';

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const latestBuild = project.buildJobs?.[0];
  const buildStatus = latestBuild?.status ?? 'NONE';
  const statusColors: Record<string, string> = {
    DONE: 'bg-blue-500/40 text-white border-blue-300/80 shadow-[0_0_20px_rgba(59,130,246,0.6)]',
    PROCESSING: 'bg-amber-500/40 text-white border-amber-300/80 shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    QUEUED: 'bg-blue-500/40 text-white border-blue-300/80 shadow-[0_0_20px_rgba(59,130,246,0.6)]',
    ERROR: 'bg-rose-500/40 text-white border-rose-300/80 shadow-[0_0_20px_rgba(244,63,94,0.6)]',
    NONE: 'bg-slate-500/20 text-slate-200 border-slate-400/50',
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
      toast.success('Project deleted successfully');
      onDelete?.();
    } catch (error) {
      console.error('Delete project error:', error);
      if (error instanceof Error) {
        toast.error(`Failed to delete project: ${error.message}`);
      } else {
        toast.error('Failed to delete project. Please check if the backend server is running.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-3xl border border-white/20 bg-[#111111] p-6 shadow-[0_0_55px_rgba(59,130,246,0.3)] transition hover:border-blue-500/30 hover:shadow-[0_0_65px_rgba(96,165,250,0.4)]">
      {/* Top row: Title, Status, and Action buttons - clearly separated */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition">
            {project.name}
          </h3>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {/* Status text - positioned between title and buttons */}
        {buildStatus !== 'NONE' && (
          <span
            className={`text-sm font-bold uppercase tracking-wide whitespace-nowrap ${buildStatus === 'DONE' ? 'text-blue-400' : buildStatus === 'PROCESSING' ? 'text-amber-400' : buildStatus === 'QUEUED' ? 'text-blue-400' : buildStatus === 'ERROR' ? 'text-red-400' : 'text-slate-400'}`}
          >
            {buildStatus}
          </span>
        )}
        
        {/* Action buttons - clearly separated on the right */}
        <div className="flex gap-2 flex-shrink-0">
          <Link
            to={`/build?project=${project.id}`}
            className="flex items-center justify-center rounded-xl border-2 border-blue-400/70 bg-blue-500/30 p-2.5 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.5)] backdrop-blur-sm transition hover:border-blue-400 hover:bg-blue-500/40 hover:text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
            onClick={(e) => e.stopPropagation()}
            title="Edit Project"
          >
            <Edit2 size={18} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowDeleteModal(true);
            }}
            className="flex items-center justify-center rounded-xl border-2 border-red-400/70 bg-red-500/30 p-2.5 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.5)] backdrop-blur-sm transition hover:border-red-400 hover:bg-red-500/40 hover:text-white hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]"
            title="Delete Project"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <Link
        to={`/build?project=${project.id}`}
        className="flex flex-col"
      >

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          {project.character && (
            <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
              <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
                <File size={12} />
                Character
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {project.character.originalName}
              </p>
            </div>
          )}
          {project.model && (
            <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
              <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
                <Package size={12} />
                Model
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {project.model.originalName}
              </p>
            </div>
          )}
          {project.worldMap && (
            <div className="rounded-2xl border border-white/20 bg-[#1A1A1A] px-3 py-2">
              <div className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-400">
                <Image size={12} />
                World Map
              </div>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {project.worldMap.originalName}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <span className="text-blue-400 group-hover:text-blue-300 transition">
            Open in Builder →
          </span>
        </div>
      </Link>

      <ConfirmModal
        open={showDeleteModal}
        title="Delete project?"
        description="This will permanently delete the project and all associated builds. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </div>
  );
}

