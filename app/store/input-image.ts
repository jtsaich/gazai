import { create } from 'zustand';

interface InputImageState {
  inputImage: string;
  loadInputImage: boolean;
  updateInputImage: (newInputImage: string) => void;
  toggleLoadInputImage: () => void;
}

export const useStore = create<InputImageState>((set) => ({
  inputImage: '',
  loadInputImage: false,
  updateInputImage: (newInputImage) => set({ inputImage: newInputImage }),
  toggleLoadInputImage: () =>
    set((state) => ({ loadInputImage: !state.loadInputImage }))
}));
