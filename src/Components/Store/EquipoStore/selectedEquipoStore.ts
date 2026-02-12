// store/selectedEquipoStore.ts
import { create } from "zustand";
import type { Equipo } from "../../typesScript/equipoFormType";

interface SelectedEquipoState {
  equipoActivo: Equipo | null;
  setEquipo: (equipo: Equipo) => void;
  clear: () => void;
}

export const useSelectedEquipoStore = create<SelectedEquipoState>((set) => ({
  equipoActivo: null,
  setEquipo: (equipo) => set({ equipoActivo: equipo }),
  clear: () => set({ equipoActivo: null }),
}));
