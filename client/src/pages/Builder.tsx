import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  CircleCheck,
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
import { getAssetUrl, createBuild, getBuild, saveProject, updateProject, uploadAsset, fetchProject } from '@/lib/api';
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  const [mode, setMode] = useState<'2d' | '3d'>('3d');
  const [characterAnimations, setCharacterAnimations] = useState<string[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [buildState, setBuildState] = useState<BuildProgressState>('idle');
  const [currentBuildStatus, setCurrentBuildStatus] = useState<string>('QUEUED');
  const [worldPreviewUrl, setWorldPreviewUrl] = useState<string | null>(null);
  const [worldImageError, setWorldImageError] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);

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

  // Load project data when editing
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        // Reset store if no project ID
        setProjectId(undefined);
        setAsset('character', undefined);
        setAsset('model', undefined);
        setAsset('worldMap', undefined);
        return;
      }

      setLoadingProject(true);
      try {
        const project = await fetchProject(projectId);
        setProjectId(project.id);

        // Load assets into store
        if (project.character) {
          setAsset('character', {
            id: project.character.id,
            type: 'character',
            originalName: project.character.originalName,
            filename: project.character.filename,
            mime: project.character.mime,
            size: project.character.size,
            url: project.character.url,
            createdAt: project.character.createdAt,
          });
        }
        if (project.model) {
          setAsset('model', {
            id: project.model.id,
            type: 'model',
            originalName: project.model.originalName,
            filename: project.model.filename,
            mime: project.model.mime,
            size: project.model.size,
            url: project.model.url,
            createdAt: project.model.createdAt,
          });
        }
        if (project.worldMap) {
          setAsset('worldMap', {
            id: project.worldMap.id,
            type: 'worldMap',
            originalName: project.worldMap.originalName,
            filename: project.worldMap.filename,
            mime: project.worldMap.mime,
            size: project.worldMap.size,
            url: project.worldMap.url,
            createdAt: project.worldMap.createdAt,
          });
          // Set world map preview URL
          setWorldPreviewUrl(project.worldMap.url);
        }

        // Update form values
        form.setValue('characterId', project.characterId || undefined);
        form.setValue('modelId', project.modelId || undefined);
        form.setValue('worldMapId', project.worldMapId || undefined);

        toast.success('Project loaded', { description: 'You can now edit your project.' });
      } catch (error) {
        toast.error('Failed to load project');
        console.error('Error loading project:', error);
      } finally {
        setLoadingProject(false);
      }
    };

    void loadProject();
  }, [projectId, form, setAsset, setProjectId]);

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
        
        // Update existing project or create new one
        const project = projectId
          ? await updateProject(projectId, values)
          : await saveProject(values);
        
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
                description: 'Your game bundle is ready. View it in your dashboard.',
                action: {
                  label: 'View Dashboard',
                  onClick: () => navigate('/creator/dashboard'),
                },
              });
              setBuildState('success');
              // Auto-navigate to dashboard after 2 seconds
              setTimeout(() => {
                navigate('/creator/dashboard');
              }, 2000);
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


  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#1A1A1A] pb-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.25),_transparent_45%)]" />
      <GradientOrbs />
      <GridPattern fade="bottom" className="opacity-30" />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-12">
        <div className="mb-8 rounded-3xl border border-white/20 bg-[#222222] p-8 shadow-[0_35px_120px_-50px_rgba(59,130,246,0.4)] backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-[#2A2A2A] px-4 py-1 text-xs uppercase tracking-[0.35em] text-white">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Builder
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                  <span className="bg-primary-gradient bg-clip-text text-transparent">
                    Build Your Game
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Segmented
                  value={mode}
                  onChange={(value) => setMode(value as '2d' | '3d')}
                  options={[
                    { label: '2D', value: '2d', disabled: true, tooltip: 'Coming soon' },
                    { label: '3D', value: '3d' },
                  ]}
                />
                <div className="flex items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-xs text-blue-200">
                  <ShieldCheck className="h-4 w-4" />
                  Real-time validation active
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Character */}
          <div className="rounded-3xl border border-white/20 bg-[#222222] p-8 shadow-[0_35px_120px_-50px_rgba(59,130,246,0.4)] backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-gradient/40 text-lg font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                1
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Upload Character</h2>
                <p className="text-sm text-gray-300">Upload your character (.glb file with animations)</p>
              </div>
            </div>
            <div className="max-w-2xl">
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
            </div>
          </div>

          {/* Step 2: Model */}
          <div className="rounded-3xl border border-white/20 bg-[#222222] p-8 shadow-[0_35px_120px_-50px_rgba(59,130,246,0.4)] backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-gradient/40 text-lg font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                2
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Upload Model</h2>
                <p className="text-sm text-gray-300">Upload your model (.glb or .gltf file for environment/props)</p>
              </div>
            </div>
            <div className="max-w-2xl">
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

          {/* Step 3: World Map (Optional) */}
          <div className="rounded-3xl border border-white/20 bg-[#222222] p-8 shadow-[0_35px_120px_-50px_rgba(59,130,246,0.4)] backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-gradient/40 text-lg font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                3
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Upload World Map (Optional)</h2>
                <p className="text-sm text-gray-300">Optionally upload a world map (PNG/JPG image)</p>
              </div>
            </div>
            <div className="max-w-2xl">
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
            </div>
          </div>

          {/* Step 4: Build */}
          <div className="rounded-3xl border border-white/20 bg-[#222222] p-8 shadow-[0_35px_120px_-50px_rgba(59,130,246,0.4)] backdrop-blur">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-gradient/40 text-lg font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                4
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Build Your Game</h2>
                <p className="text-sm text-gray-300">Preview your assets and build when ready</p>
              </div>
            </div>
            <div className="max-w-2xl rounded-2xl border border-white/20 bg-[#2A2A2A] p-6">
              <p className="text-sm text-gray-200">
                Once you've uploaded your assets, click the <strong className="text-white">Build Game</strong> button at the bottom of the page to create your game bundle.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/20 bg-[#1A1A1A]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            {buildState === 'building' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Building… current status: {currentBuildStatus}</span>
              </>
            ) : buildState === 'success' ? (
              <>
                <CircleCheck className="h-4 w-4 text-blue-400" />
                <span>Build completed successfully. View in dashboard.</span>
              </>
            ) : (
              <span>Select assets and hit build when ready.</span>
            )}
          </div>
          <div className="flex gap-3">
            {buildState === 'success' && (
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() => navigate('/creator/dashboard')}
              >
                View Dashboard
              </Button>
            )}
            <Button
              className="w-full sm:w-auto opacity-50 cursor-not-allowed"
              disabled={true}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
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

