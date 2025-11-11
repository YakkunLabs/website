import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Box,
  CircleCheck,
  Cpu,
  Flame,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { z } from 'zod';

import { AnimationSelector } from '@/components/AnimationSelector';
import { GridPattern } from '@/components/backgrounds/GridPattern';
import { Segmented } from '@/components/Segmented';
import { ThreeViewer } from '@/components/ThreeViewer';
import { UploadCard } from '@/components/UploadCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getAssetUrl, createBuild, getBuild, saveProject, uploadAsset } from '@/lib/api';
import { useProjectStore } from '@/store/useProject';

const formSchema = z
  .object({
    characterId: z.string().optional(),
    modelId: z.string().optional(),
    worldMapId: z.string().optional(),
  })
  .refine(
    (value) => Boolean(value.characterId || value.modelId),
    'Upload at least a character or a model.',
  );

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const characterFileSchema = z
  .instanceof(File, { message: 'Please provide a valid file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 100MB.')
  .refine(
    (file) => file.name.toLowerCase().endsWith('.glb'),
    'Characters must be a .glb file.',
  );

const modelFileSchema = z
  .instanceof(File, { message: 'Please provide a valid file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 100MB.')
  .refine(
    (file) => /\.(glb|gltf)$/i.test(file.name),
    'Models must be .glb or .gltf files.',
  );

const worldFileSchema = z
  .instanceof(File, { message: 'Please provide a valid file.' })
  .refine((file) => file.size <= MAX_FILE_SIZE, 'Max file size is 100MB.')
  .refine(
    (file) => /\.(png|jpg|jpeg)$/i.test(file.name),
    'World maps must be .png or .jpg files.',
  );

type BuilderFormValues = z.infer<typeof formSchema>;

type BuildProgressState = 'idle' | 'building' | 'success';

export function Builder() {
  const [mode, setMode] = useState<'2d' | '3d'>('3d');
  const [characterAnimations, setCharacterAnimations] = useState<string[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [buildState, setBuildState] = useState<BuildProgressState>('idle');
  const [currentBuildStatus, setCurrentBuildStatus] = useState<string>('QUEUED');
  const [worldPreviewUrl, setWorldPreviewUrl] = useState<string | null>(null);
  const [worldImageError, setWorldImageError] = useState(false);

  const { character, model, worldMap, setAsset, setProjectId } = useProjectStore();

  const form = useForm<BuilderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      characterId: character?.id,
      modelId: model?.id,
      worldMapId: worldMap?.id,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.setValue('characterId', character?.id);
  }, [character?.id, form]);

  useEffect(() => {
    form.setValue('modelId', model?.id);
  }, [model?.id, form]);

  useEffect(() => {
    form.setValue('worldMapId', worldMap?.id);
  }, [worldMap?.id, form]);

  const handleUpload =
    (type: 'character' | 'model' | 'worldMap') =>
    async (file: File, onProgress: (progress: number) => void) => {
      let tempPreviewUrl: string | null = null;
      if (type === 'worldMap') {
        tempPreviewUrl = URL.createObjectURL(file);
        setWorldPreviewUrl((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return tempPreviewUrl;
        });
        setWorldImageError(false);
      }

      try {
        switch (type) {
          case 'character':
            characterFileSchema.parse(file);
            break;
          case 'model':
            modelFileSchema.parse(file);
            break;
          case 'worldMap':
            worldFileSchema.parse(file);
            break;
          default:
            break;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.issues[0]?.message ?? 'Invalid file.');
        }
        throw error;
      }

      const asset = await uploadAsset(type, file, onProgress);
      setAsset(type, { ...asset, previewUrl: tempPreviewUrl ?? asset.previewUrl });
      if (type === 'character') {
        setCharacterAnimations([]);
        setSelectedAnimation(null);
      }
    };

  const isBuildDisabled = !character && !model;

  const handleBuild = useCallback(
    async (values: BuilderFormValues) => {
      try {
        setBuildState('building');
        const project = await saveProject(values);
        setProjectId(project.id);
        const { jobId } = await createBuild(project.id);
        toast.info('Building…', { description: 'Your assets are being processed.' });
        setCurrentBuildStatus('QUEUED');

        let attempts = 0;
        const maxAttempts = 6;

        const poll = async () => {
          attempts += 1;
          try {
            const job = await getBuild(jobId);
            setCurrentBuildStatus(job.status);
            if (job.status === 'DONE') {
              toast.success('Build completed!', {
                description: 'Your game bundle is ready.',
              });
              setBuildState('success');
              return;
            }
            if (job.status === 'ERROR') {
              throw new Error(job.logs ?? 'Build failed.');
            }
            if (attempts < maxAttempts) {
              setTimeout(poll, 2000);
            } else {
              toast.warning('Build still running…', {
                description: 'Check back shortly for completion.',
              });
              setBuildState('idle');
            }
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Failed to check build status.';
            toast.error(message);
            setBuildState('idle');
          }
        };

        poll();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to start build.';
        toast.error(message);
        setBuildState('idle');
      }
    },
    [setProjectId],
  );

  const onSubmit = form.handleSubmit(handleBuild, (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast.error(firstError.message.toString());
    }
  });

  const characterUrl = useMemo(() => getAssetUrl(character), [character]);
  const modelUrl = useMemo(() => getAssetUrl(model), [model]);
  const worldUrl = useMemo(() => getAssetUrl(worldMap), [worldMap]);
  const worldImageSrc = useMemo(() => {
    if (worldImageError && worldPreviewUrl) {
      return worldPreviewUrl;
    }
    return worldUrl ?? worldPreviewUrl ?? undefined;
  }, [worldImageError, worldPreviewUrl, worldUrl]);

  useEffect(() => {
    setWorldImageError(false);
  }, [worldUrl]);

  useEffect(() => {
    return () => {
      if (worldPreviewUrl) {
        URL.revokeObjectURL(worldPreviewUrl);
      }
    };
  }, [worldPreviewUrl]);

  const uploadsCount = useMemo(
    () => [character, model, worldMap].filter(Boolean).length,
    [character, model, worldMap],
  );

  const stats = [
    {
      icon: Box,
      label: 'Assets linked',
      value: uploadsCount,
      helper: uploadsCount === 0 ? 'Add a character or model to begin.' : 'Ready to bundle.',
    },
    {
      icon: Cpu,
      label: 'Pipeline mode',
      value: '3D Builder',
      helper: 'Optimized for GLB / GLTF previews.',
    },
    {
      icon: ShieldCheck,
      label: 'Validation',
      value: 'Strict',
      helper: 'File types & sizes enforced automatically.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pb-32">
      <GridPattern fade="bottom" className="opacity-30" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-12">
        <div className="rounded-3xl border border-border/60 bg-surface/80 p-8 shadow-[0_35px_120px_-50px_rgba(109,40,217,0.45)] backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-4 py-1 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Builder
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Curate your launch-ready experience
                </h1>
                <p className="text-sm text-muted-foreground sm:text-base">
                  Upload characters, props, and landscapes to auto-generate metaverse-ready builds.
                  Toggle between pipelines, preview 3D assets instantly, and queue builds with a
                  single click.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Segmented
                  value={mode}
                  onChange={(value) => setMode(value as '2d' | '3d')}
                  options={[
                    { label: '2D', value: '2d', disabled: true, tooltip: 'Coming soon' },
                    { label: '3D', value: '3d' },
                  ]}
                />
                <div className="flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Real-time validation active
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map(({ icon: Icon, label, value, helper }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-[0_18px_45px_-35px_rgba(6,182,212,0.65)] transition hover:-translate-y-0.5 hover:border-primary/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-gradient/30 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                          {label}
                        </p>
                        <p className="text-lg font-semibold text-white">{value}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
                  </div>
                ))}
              </div>
            </div>
            <TipsCard buildState={buildState} currentBuildStatus={currentBuildStatus} />
          </div>
        </div>

        <Separator className="my-10 border-none bg-border" />

        <div className="grid gap-6 lg:grid-cols-3">
          <UploadCard
            title="World map"
            description="Optional top-down layout of your world."
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
            }}
            onUpload={handleUpload('worldMap')}
            uploadedFileName={worldMap?.originalName}
            preview={
              worldImageSrc ? (
                <img
                  src={worldImageSrc}
                  alt="World map preview"
                  className="aspect-video w-full rounded-lg object-cover"
                  onError={() => {
                    if (!worldImageError && worldPreviewUrl) {
                      setWorldImageError(true);
                    }
                  }}
                />
              ) : undefined
            }
          />

          <UploadCard
            title="Character"
            description=".glb file with rig and animations."
            accept={{ 'model/gltf-binary': ['.glb'] }}
            onUpload={handleUpload('character')}
            uploadedFileName={character?.originalName}
            preview={
              characterUrl ? (
                <div className="space-y-4">
                  <ThreeViewer
                    url={characterUrl}
                    animationName={selectedAnimation}
                    onAnimationsLoaded={(names) => setCharacterAnimations(names)}
                  />
                  <AnimationSelector
                    animations={characterAnimations}
                    value={selectedAnimation}
                    onChange={setSelectedAnimation}
                    label="Play animation"
                  />
                </div>
              ) : undefined
            }
          />

          <UploadCard
            title="Model"
            description="Environment or props as .glb or .gltf."
            accept={{
              'model/gltf-binary': ['.glb'],
              'model/gltf+json': ['.gltf'],
            }}
            onUpload={handleUpload('model')}
            uploadedFileName={model?.originalName}
            preview={
              modelUrl ? (
                <ThreeViewer url={modelUrl} animationName={null} />
              ) : undefined
            }
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {buildState === 'building' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Building… current status: {currentBuildStatus}</span>
              </>
            ) : buildState === 'success' ? (
              <>
                <CircleCheck className="h-4 w-4 text-emerald-400" />
                <span>Build completed successfully. Ready to deploy.</span>
              </>
            ) : (
              <span>Select assets and hit build when ready.</span>
            )}
          </div>
          <Button
            className="w-full sm:w-auto"
            disabled={isBuildDisabled || buildState === 'building'}
            onClick={onSubmit}
          >
            {buildState === 'building' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Building…
              </>
            ) : (
              'Build Game'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TipsCard({
  buildState,
  currentBuildStatus,
}: {
  buildState: BuildProgressState;
  currentBuildStatus: string;
}) {
  const items = [
    {
      icon: Flame,
      title: 'Compress animations',
      description: 'Upload rigged GLB/GLTF files with baked clips for best playback results.',
    },
    {
      icon: Info,
      title: 'Builds run in waves',
      description: 'Jobs cycle through queued, processing, then done. Expect ~10 seconds total.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure by default',
      description: 'Uploads are rate-limited, sanitized, and stored in isolated workspaces.',
    },
  ];

  return (
    <aside className="w-full max-w-sm space-y-4 rounded-2xl border border-border/60 bg-background/70 p-6 shadow-[0_25px_80px_-55px_rgba(109,40,217,0.65)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span>Builder intel</span>
        <span>gg.play</span>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary-100">
        <p className="text-xs uppercase tracking-[0.35em] text-primary-100">
          Build status
        </p>
        <p className="mt-2 text-sm text-white">
          {buildState === 'building'
            ? `Pipeline is ${currentBuildStatus.toLowerCase()}…`
            : 'Queue is idle. Upload assets and trigger a build when ready.'}
        </p>
      </div>
      <div className="space-y-4">
        {items.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex gap-4 rounded-xl border border-border/60 bg-background/80 p-3">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient/40 text-white">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

