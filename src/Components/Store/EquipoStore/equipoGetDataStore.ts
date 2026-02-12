// equipoGetData.ts
import { create } from "zustand";
import { equiposFirebaseData } from "../../data/equipoFirebaseData";
import type { Equipo } from "../../typesScript/equipoFormType";

type EquipoStore = {
  equiposData: Equipo[];
  loading: boolean;

  cargarDesdeFirebase: () => Promise<void>;
  actualizarEquipo: (id: string, data: Partial<Equipo>) => void;
  eliminarEquipo: (id: string) => void;
};

export const useEquipoGetDataStore = create<EquipoStore>((set) => ({
  equiposData: [],
  loading: false,

  cargarDesdeFirebase: async () => {
    set({ loading: true });
    try {
      // Tu lógica de carga
      // const data = await fetchEquipos(); // tu función
      set({ equiposData: equiposFirebaseData, loading: false });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },
  // cargarDesdeFirebase: async () => {
  //   set({ loading: true });

  //   // simulamos Firebase
  //   await new Promise((res) => setTimeout(res, 600));

  //   set({
  //     equiposData: equiposMock,
  //     loading: false,
  //   });
  // },

  actualizarEquipo: (id, data) => set((state) => ({
    equiposData: state.equiposData.map((eq) =>
      eq.id === id ? { ...eq, ...data } : eq
    ),
  })),

  eliminarEquipo: (id) =>
    set((state) => ({
      equiposData: state.equiposData.filter((eq) => eq.id !== id),
    })),
}));
