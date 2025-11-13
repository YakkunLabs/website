import { useCallback, useState } from 'react';
import { useDropzone, type DropzoneOptions } from 'react-dropzone';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';

export interface UploadCardProps {
  title: string;
  description: string;
  accept: DropzoneOptions['accept'];
  onUpload: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  uploadedFileName?: string;
  preview?: React.ReactNode;
  footer?: React.ReactNode;
  maxSizeMB?: number;
}

export function UploadCard({
  title,
  description,
  accept,
  onUpload,
  uploadedFileName,
  preview,
  footer,
  maxSizeMB = 100,
}: UploadCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);
      setProgress(1);
      try {
        await onUpload(file, (value) => setProgress(Math.max(1, value)));
        toast.success(`${title} uploaded`);
        setProgress(100);
        setTimeout(() => setProgress(null), 600);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Something went wrong while uploading.';
        setError(message);
        toast.error(message);
        setProgress(null);
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, title],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleDrop,
    accept,
    multiple: false,
    maxSize: maxSizeMB * 1024 * 1024,
    noClick: true,
  });

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={open}
            disabled={isUploading}
            className="h-9"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Browse'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            'group relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-[#222222] p-6 text-center transition hover:border-blue-500/40',
            isDragActive && 'border-primary shadow-glow',
            isUploading && 'cursor-progress opacity-70',
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-4 h-10 w-10 text-primary" />
          <p className="text-sm text-gray-300">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop or use the Browse button'}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Max size {maxSizeMB}MB
          </p>
          {uploadedFileName && (
            <p className="mt-4 rounded-full bg-muted/60 px-4 py-1 text-xs text-white">
              {uploadedFileName}
            </p>
          )}
          {progress !== null && (
            <div className="absolute inset-x-4 bottom-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary-gradient transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">{progress}%</p>
            </div>
          )}
        </div>
        {preview && (
          <div className="overflow-hidden rounded-xl border border-white/20 bg-[#222222] p-3">
            {preview}
          </div>
        )}
        {error && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}
        {footer}
      </CardContent>
    </Card>
  );
}

