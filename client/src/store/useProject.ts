import { create } from 'zustand';

export type AssetType = 'character' | 'model' | 'worldMap';

export interface Asset {
  id: string;
  type: AssetType;
  originalName: string;
  filename: string;
  mime: string;
  size: number;
  url: string;
  createdAt: string;
  previewUrl?: string;
}

interface ProjectState {
  projectId?: string;
  character?: Asset;
  model?: Asset;
  worldMap?: Asset;
  setAsset: (type: AssetType, asset?: Asset) => void;
  setProjectId: (id?: string) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectId: undefined,
  character: undefined,
  model: undefined,
  worldMap: undefined,
  setAsset: (type, asset) =>
    set((state) => ({
      ...state,
      [type === 'worldMap' ? 'worldMap' : type]: asset,
    })),
  setProjectId: (id) =>
    set((state) => ({
      ...state,
      projectId: id,
    })),
  reset: () =>
    set({
      projectId: undefined,
      character: undefined,
      model: undefined,
      worldMap: undefined,
    }),
}));

