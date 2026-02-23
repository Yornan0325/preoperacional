import { create } from "zustand";
import type { Equipo } from "../../typesScript/equipoFormType";
import { getEquiposFromFirebase } from "../../Firebase/Service/servicesGet";
import { updateEquipoInFirebase } from "../../Firebase/Service/servicesSet";

type EquipoStore = {
  equiposData: Equipo[];
  loading: boolean;
  error: string | null;
  actualizarEquipo: (id: string, data: Partial<Equipo>) => Promise<void>;
  cargarEquipos: () => Promise<void>;
  actualizarEquipoState: (id: string, data: Partial<Equipo>) => void;
  eliminarEquipoState: (id: string) => void;
};

export const useEquipoGetDataStore = create<EquipoStore>((set, get) => ({
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


  actualizarEquipo: async (id: string, data: Partial<any>) => {
    set({ loading: true });
    try {
      // 1. Llamada al servicio de Firebase
      await updateEquipoInFirebase(id, data);

      // 2. Si la DB responde bien, actualizamos el estado local
      get().actualizarEquipoState(id, data);

      set({ loading: false });
    } catch (error) {
      console.error(error);
      set({ error: "Error al actualizar en el servidor", loading: false });
      throw error; // Lanzamos el error para que el Modal lo atrape
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

