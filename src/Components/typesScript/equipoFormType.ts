

export const estadoEquipo = {
  MANTENIMIENTO: 'MANTENIMIENTO',
  EN_OBRA: 'EN OBRA',
  DISPONIBLE: 'DISPONIBLE',
  FUERA_DE_LINEA: 'FUERA DE LINEA',
} as const;

export type estadoEquipo = (typeof estadoEquipo)[keyof typeof estadoEquipo];
export type EstadoEquipo = estadoEquipo;

export interface Equipo {
  id: string;
  nombre: string;
  placa: string;
  marca: string;
  modelo: string;
  serial: string;
  relacionFormato: string;
  estado: estadoEquipo;
  proyecto: string;
  ubicacion: string;
  zona: string;
  imagen: string;
  asignadoOperador: {
    nombre: string;
    cargo: string;
  } | null;
  mensaje?: string;
}