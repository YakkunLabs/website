import axios from 'axios';

import type { Asset } from '@/store/useProject';

const API_BASE_URL = import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// Add auth token interceptor for authenticated requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('yl_creator_token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add error interceptor for better error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const networkError = new Error('Network Error: Cannot connect to server. Make sure the backend server is running on ' + API_BASE_URL);
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    } else if (error.response) {
      // Handle 401 (token expired) - redirect to login
      if (error.response.status === 401) {
        const errorData = error.response.data as { code?: string; message?: string };
        if (errorData.code === 'TOKEN_EXPIRED' || errorData.message?.includes('expired')) {
          // Clear auth and redirect to login
          if (typeof window !== 'undefined') {
            const token = window.localStorage.getItem('yl_creator_token');
            if (token) {
              window.localStorage.removeItem('yl_creator_token');
              window.localStorage.removeItem('yl_creator_email');
              window.dispatchEvent(new Event('creatorAuthChange'));
              if (!window.location.pathname.includes('/creator/login')) {
                window.location.href = '/creator/login';
              }
            }
          }
        }
      }
      // Server responded with error status
      const serverError = new Error(error.response.data?.message || error.message || 'Server Error');
      (serverError as any).status = error.response.status;
      (serverError as any).response = error.response;
      return Promise.reject(serverError);
    }
    return Promise.reject(error);
  },
);

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
  userId?: string;
  characterId?: string;
  modelId?: string;
  worldMapId?: string;
  character?: { originalName: string; url: string } | null;
  model?: { originalName: string; url: string } | null;
  worldMap?: { originalName: string; url: string } | null;
  buildJobs?: Array<{ status: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}

export async function saveProject(payload: SaveProjectPayload): Promise<Project> {
  const response = await apiClient.post<{ project: Project }>('/api/project', payload);
  return response.data.project;
}

export async function updateProject(id: string, payload: SaveProjectPayload): Promise<Project> {
  const response = await apiClient.put<{ project: Project }>(`/api/project/${id}`, payload);
  return response.data.project;
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/api/project/${id}`);
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>('/api/project');
  return response.data;
}

export async function fetchProject(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/api/project/${id}`);
  return response.data;
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

