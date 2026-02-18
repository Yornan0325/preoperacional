import { create } from "zustand";
import type { Equipo } from "../../typesScript/equipoFormType";
import { getEquiposFromFirebase } from "../../Firebase/Service/servicesGet";
 
type EquipoStore = {
  equiposData: Equipo[];
  loading: boolean;
  error: string | null;

  cargarEquipos: () => Promise<void>;
  actualizarEquipoState: (id: string, data: Partial<Equipo>) => void;
  eliminarEquipoState: (id: string) => void;
};

export const useEquipoGetDataStore = create<EquipoStore>((set) => ({
  equiposData: [],
  loading: false,
  error: null,

  cargarEquipos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getEquiposFromFirebase(); // Llamada real a Firebase
      set({ equiposData: data, loading: false });
    } catch (error) {
      set({ 
        error: "No se pudieron cargar los equipos", 
        loading: false 
      });
    }
  },

  // Actualiza solo el estado local (UI) después de una edición exitosa
  actualizarEquipoState: (id, data) => set((state) => ({
    equiposData: state.equiposData.map((eq) =>
      eq.id === id ? { ...eq, ...data } : eq
    ),
  })),

  // Elimina del estado local (UI) después de borrar en Firebase
  eliminarEquipoState: (id) =>
    set((state) => ({
      equiposData: state.equiposData.filter((eq) => eq.id !== id),
    })),
}));