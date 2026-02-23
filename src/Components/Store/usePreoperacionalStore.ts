import { create } from 'zustand';
import type { Preoperacional } from '../typesScript/preoperacionalType';
import { getEstadoMensualEquipos } from '../Firebase/Service/servicesGet';

interface PreoperacionalState {
  equipoId: string | null;
  fecha: Date | null;
  preoperacional: any | null;
  loading: boolean;

  registros: any[];
  fechasSeleccionadas: string[]; // Guardamos fechas en formato ISO (YYYY-MM-DD)
  seleccionarDia: (equipoId: string, fecha: Date) => void;
  actualizarPreoperacional: (data: Partial<Preoperacional>) => void;
  setRegistros: (registros: any[]) => void;
  cargarRegistros: (equipoId: string, mes?: string, anio?: string) => Promise<void>;
  setFecha: (fecha: Date) => void;
  toggleFechaSeleccionada: (fechaISO: string) => void;
  setFechasSeleccionadas: (fechas: string[]) => void;
  reset: () => void;
}

export const usePreoperacionalStore = create<PreoperacionalState>((set) => ({
  equipoId: null,
  fecha: new Date(),
  preoperacional: null,
  loading: false,
  registros: [],
  fechasSeleccionadas: [],

  cargarRegistros: async (equipoId, mes = (new Date().getMonth() + 1).toString().padStart(2, '0'), anio = new Date().getFullYear().toString()) => {
    if (!equipoId) return;

    set({ loading: true });
    try {
      // La mejor decisión es obtener siempre el mapa mensual
      // Esto asegura que solo descargamos ~30 documentos y no cientos
      const mapa = await getEstadoMensualEquipos(equipoId, mes, anio);

      // Convertimos el mapa a array para el estado 'registros'
      const data = Object.values(mapa);

      set({ registros: data, loading: false });
    } catch (error) {
      console.error("Error cargando registros:", error);
      set({ loading: false, registros: [] }); // Limpiamos registros en caso de error
    }
  },

  setRegistros: (registros) => set({ registros }),

  setFecha: (fecha: Date) => set({ fecha }),

  seleccionarDia: (equipoId, fecha) => {
    set((state) => {
      // 1. Buscamos si ya existe un registro para este día en lo que descargamos de Firebase
      const fechaISO = fecha.toLocaleDateString("en-CA");
      const registroExistente = state.registros.find(
        (r) => r.equipoId === equipoId && r.fechaInspeccion === fechaISO
      );

      // 2. Si existe, cargamos sus datos. Si no, cargamos el formato en blanco.
      return {
        equipoId,
        fecha,
        preoperacional: registroExistente ? { ...registroExistente } : {
          horometro: {
            inicio: 0,
            fin: 0,
            tanqueoGalones: 0,
            horometroTanqueo: 0,
            acpmInicio: 'vacio',
            acpmFin: 'vacio',
          },
          motorBomba: {
            nivelAceiteMotor: { ok: true },
            nivelCombustible: { ok: true },
            nivelRefrigerante: { ok: true },
            nivelAceiteHidraulico: { ok: true },
            manguerasHidraulicas: { ok: true },
            acoplesUniones: { ok: true },
            bombaHidraulica: { ok: true },
            filtros: {
              aceiteMotor: { ok: true },
              aire: { ok: true },
              combustible: { ok: true },
              aceiteHidraulico: { ok: true },
            },
          },
          estadoMecanico: {
            cilindrosHidraulicos: { ok: true },
            graseras: { ok: true },
            mandosControl: { ok: true },
            indicadoresManometros: { ok: true },
            tuboEscape: { ok: true },
            tableroLectura: { ok: true },
            bateriaElectrico: { ok: true },
            tolvaTornillos: { ok: true },
            estadoLlantas: { ok: true },
            aseoPintura: { ok: true },
            funcionamientoGeneral: { ok: true },
          },
          firmaCis: undefined
        }
      };
    });
  },

  actualizarPreoperacional: (data) =>
    set((state) => ({
      preoperacional: state.preoperacional
        ? { ...state.preoperacional, ...data }
        : null,
    })),

  toggleFechaSeleccionada: (fechaISO) => {
    set((state) => ({
      fechasSeleccionadas: state.fechasSeleccionadas.includes(fechaISO)
        ? state.fechasSeleccionadas.filter((f) => f !== fechaISO)
        : [...state.fechasSeleccionadas, fechaISO],
    }));
  },

  setFechasSeleccionadas: (fechas) => set({ fechasSeleccionadas: fechas }),

  reset: () =>
    set({
      equipoId: null,
      fecha: null,
      preoperacional: null,
      fechasSeleccionadas: [],
    }),
}));