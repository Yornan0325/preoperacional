// import { create } from 'zustand';

// interface StepsStore {
//   step: number;
//   maxSteps: number;
//   setStep: (step: number) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   resetSteps: () => void;
//   setMaxSteps: (max: number) => void;
//   canGoNext: () => boolean;
//   canGoPrev: () => boolean;
// }

// export const useStepsStore = create<StepsStore>((set, get) => ({
//   step: 1,
//   maxSteps: 1, // Valor inicial
//   setStep: (step) => {
//     const currentMaxSteps = get().maxSteps;
//     if (step >= 1 && step <= currentMaxSteps) {
//       set({ step });
//     }
//   },
//   nextStep: () => set((state) => ({
//     step: state.step < state.maxSteps ? state.step + 1 : state.step
//   })),
//   prevStep: () => set((state) => ({
//     step: state.step > 1 ? state.step - 1 : state.step
//   })),
//   resetSteps: () => set({ step: 1 }),
//   setMaxSteps: (maxSteps) => set({ maxSteps }),
//   canGoNext: () => get().step < get().maxSteps,
//   canGoPrev: () => get().step > 1,
// }));

// Store/useStepsStore.ts
import { create } from 'zustand';

interface StepsState {
  step: number;
  maxSteps: number;
  
  // Acciones
  setStep: (step: number) => void;
  setMaxSteps: (max: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
}

export const useStepsStore = create<StepsState>((set, get) => ({
  step: 1,
  maxSteps: 1,
  
  setStep: (step: number) => {
    const { maxSteps } = get();
    if (step >= 1 && step <= maxSteps) {
      set({ step });
    }
  },
  
  setMaxSteps: (max: number) => set({ maxSteps: max }),
  
  nextStep: () => {
    const { step, maxSteps } = get();
    if (step < maxSteps) {
      set({ step: step + 1 });
    }
  },
  
  prevStep: () => {
    const { step } = get();
    if (step > 1) {
      set({ step: step - 1 });
    }
  },
  
  resetSteps: () => set({ step: 1 }),
  
  canGoNext: () => {
    const { step, maxSteps } = get();
    return step < maxSteps;
  },
  
  canGoPrev: () => {
    const { step } = get();
    return step > 1;
  },
}));