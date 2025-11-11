import axios from 'axios';

import type { Asset } from '@/store/useProject';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export interface UploadAssetResponse {
  asset: Asset;
}

export type AssetUploadType = 'character' | 'model' | 'worldMap';

export async function uploadAsset(
  type: AssetUploadType,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<Asset> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadAssetResponse>(
    `/api/upload/${type}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      },
    },
  );

  return response.data.asset;
}

export interface SaveProjectPayload {
  characterId?: string;
  modelId?: string;
  worldMapId?: string;
}

export interface Project {
  id: string;
  name: string;
  characterId?: string;
  modelId?: string;
  worldMapId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function saveProject(payload: SaveProjectPayload): Promise<Project> {
  const response = await apiClient.post<{ project: Project }>('/api/project', payload);
  return response.data.project;
}

export interface CreateBuildResponse {
  jobId: string;
}

export async function createBuild(projectId: string): Promise<CreateBuildResponse> {
  const response = await apiClient.post<CreateBuildResponse>('/api/build', { projectId });
  return response.data;
}

export type BuildStatus = 'QUEUED' | 'PROCESSING' | 'DONE' | 'ERROR';

export interface BuildJobStatusResponse {
  status: BuildStatus;
  logs?: string;
}

export async function getBuild(jobId: string): Promise<BuildJobStatusResponse> {
  const response = await apiClient.get<BuildJobStatusResponse>(`/api/build/${jobId}`);
  return response.data;
}

export function getAssetUrl(asset?: Asset | null): string | undefined {
  if (!asset) return undefined;
  return new URL(asset.url, API_BASE_URL).toString();
}

