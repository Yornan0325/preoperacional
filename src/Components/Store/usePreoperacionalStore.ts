import { create } from 'zustand';
import type { Preoperacional } from '../typesScript/preoperacionalType';

interface PreoperacionalState {
  equipoId: string | null;
  fecha: Date | null;
  preoperacional: Preoperacional | null;


  registros: any[];
  seleccionarDia: (equipoId: string, fecha: Date) => void;
  actualizarPreoperacional: (data: Partial<Preoperacional>) => void;
  setFecha: (fecha: Date) => void;
  reset: () => void;
}

export const usePreoperacionalStore = create<PreoperacionalState>((set) => ({
  equipoId: null,
  fecha: null,
  preoperacional: null,
  registros: [true],

  setFecha: (fecha: Date) =>set({ fecha }),
  
  seleccionarDia: (equipoId, fecha) =>
    set({
      equipoId,
      fecha,

      preoperacional: {
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
      },
    }),



  actualizarPreoperacional: (data) =>
    set((state) => ({
      preoperacional: state.preoperacional
        ? { ...state.preoperacional, ...data }
        : null,
    })),

  reset: () =>
    set({
      equipoId: null,
      fecha: null,
      preoperacional: null,

    }),
}));