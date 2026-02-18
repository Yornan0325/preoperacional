// import { formatoFirebaseData } from "../../data/formatofirebaseData";
import { create } from "zustand";
import type { FormatoCompleto, FormatoPreoperacional } from "../../typesScript/preoperacionalType";
import { uploadFormatoToFirebase } from "../../Firebase/Service/servicesSet";
import { getFormatosFromFirebase } from "../../Firebase/Service/servicesGet";

type FormatoStore = {
  formatoData: FormatoPreoperacional[];
  loading: boolean;
  error: string | null;
  cargarFormatos: () => Promise<void>;
  actualizarFormato: (id: string, data: FormatoPreoperacional) => void;
  eliminarFormato: (id: string) => void;
  guardarFormato: (formato: FormatoCompleto) => Promise<void>;
}


export const useFormatoGetDataStore = create<FormatoStore>((set) => ({
  formatoData: [],
  loading: false,
  error: null,

  // cargarDesdeFirebase: async () => {
  //   set({ loading: true });
  //   try {
  //     // Simulamos carga desde Firebase
  //     await new Promise((resolve) => setTimeout(resolve, 800));
  //     set({
  //       formatoData: formatoFirebaseData as unknown as FormatoPreoperacional[],
  //       loading: false
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     set({ loading: false });
  //   }
  // },

  cargarFormatos: async () => {
    set({ loading: true, error: null });
    try {
      // Llamada al servicio real
      const data = await getFormatosFromFirebase();
      set({ formatoData: data, loading: false });
    } catch (error) {
      console.error("Error en Store al cargar formatos:", error);
      set({ loading: false, error: "Error al sincronizar con Firebase" });
    }
  },





  guardarFormato: async (formato) => {
    set({ loading: true });
    try {
      // 1. Llamamos al servicio (Firebase)
      const formatoGuardado = await uploadFormatoToFirebase(formato);

      // 2. Forzamos el ID para que no sea undefined antes de actualizar el estado
      if (!formatoGuardado.id) throw new Error("Firebase no retornó un ID válido");

      const nuevoFormato = formatoGuardado as unknown as FormatoPreoperacional;

      set((state) => {
        const existe = state.formatoData.some(f => f.id === nuevoFormato.id);
        if (existe) {
          return {
            formatoData: state.formatoData.map(f => f.id === nuevoFormato.id ? nuevoFormato : f),
            loading: false
          };
        } else {
          return {
            formatoData: [nuevoFormato, ...state.formatoData],
            loading: false
          };
        }
      });
    } catch (error) {
      console.error("Error detallado en Store:", error);
      set({ loading: false });
      throw error; // Re-lanzamos para que el componente capture el error
    }
  },

  actualizarFormato: (id, data) => set((state) => ({
    formatoData: state.formatoData.map((eq) =>
      eq.id === id ? { ...eq, ...data } : eq
    ),
  })),

  eliminarFormato: (id) => set((state) => ({
    formatoData: state.formatoData.filter((eq) => eq.id !== id),
  })),

}));