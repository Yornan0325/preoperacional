import { formatoFirebaseData } from "../../data/formatofirebaseData";
import { create } from "zustand";
import type { FormatoPreoperacional } from "../../typesScript/preoperacionalType";

type FormatoStore = {
  formatoData: FormatoPreoperacional[];
  loading: boolean;
  cargarDesdeFirebase: () => Promise<void>;
  actualizarFormato: (id: string, data: FormatoPreoperacional) => void;
  eliminarFormato: (id: string) => void;
}


export const useFormatoGetDataStore = create<FormatoStore>((set) => ({
  formatoData: [],
  loading: false,

   cargarDesdeFirebase: async () => {
    set({ loading: true });
    try {
      // Simulamos carga desde Firebase
      await new Promise((resolve) => setTimeout(resolve, 800));
      set({ 
        formatoData: formatoFirebaseData as unknown as FormatoPreoperacional[], 
        loading: false 
      });
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
  //     formatoData: formatoFirebaseData,
  //     loading: false,
  //   });
  // },

  actualizarFormato: (id, data) => set((state) => ({
    formatoData: state.formatoData.map((eq) =>
      eq.id === id ? { ...eq, ...data } : eq
    ),
  })),

  eliminarFormato: (id) =>
    set((state) => ({
      formatoData: state.formatoData.filter((eq) => eq.id !== id),
    })),
}));