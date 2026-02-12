import { create } from "zustand";
import type { FormatoCompleto } from "../../typesScript/preoperacionalType";

type PreoperacionalState = {
  formato: FormatoCompleto;
  setChecklistValue: (seccionId: string, itemId: string, value: boolean) => void; // Ahora maneja IDs anidados
  setObservaciones: (text: string) => void;
  setFormato: (formato: FormatoCompleto) => void;
}

const useSelectedFormatoStore = create<PreoperacionalState>((set) => ({
  formato: {
    id: "",
    nombreFormato: "",
    version: "",
    fechaCreacion: "",
    fechaActualizacion: "",
    fechaRevision: "",
    numeralSIG: "",
    checklist: [], // Asumiendo que cada objeto aquí tiene { id, titulo, items: [] }
    estado: 'ACTIVO',
    observaciones: "",
  },
  
  setFormato: (formato) => set({ formato }),

  // Optimizado para buscar el item dentro de la sección correcta
  setChecklistValue: (seccionId, itemId, value) =>
    set((state) => ({
      formato: {
        ...state.formato,
        checklist: state.formato.checklist.map((seccion) => {
          if (seccion.id === seccionId) {
            return {
              ...seccion,
              items: seccion.items.map((item: any) =>
                item.id === itemId ? { ...item, cumple: value } : item
              ),
            };
          }
          return seccion;
        }),
      },
    })),

  setObservaciones: (text) =>
    set((state) => ({
      formato: {
        ...state.formato,
        observaciones: text,
      },
    })),
}));

export default useSelectedFormatoStore;