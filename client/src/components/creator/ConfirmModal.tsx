import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-[#111111] p-6 shadow-[0_0_45px_rgba(59,130,246,0.5)]">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(96,165,250,0.35)] transition hover:from-[#2563EB] hover:to-[#93C5FD] disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}


