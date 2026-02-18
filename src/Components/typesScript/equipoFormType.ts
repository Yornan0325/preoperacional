

export const estadoEquipo = {
  MANTENIMIENTO: 'MANTENIMIENTO',
  EN_OBRA: 'EN OBRA',
  DISPONIBLE: 'DISPONIBLE',
  FUERA_DE_LINEA: 'FUERA DE LINEA',
} as const;

export type estadoEquipo = (typeof estadoEquipo)[keyof typeof estadoEquipo];
export type EstadoEquipo = estadoEquipo;

export interface Equipo {
  nombreEquipo: any;
  id: string;
  placa: string;
  marca: string;
  serial: string;
  relacionFormato: string;
  estado: estadoEquipo;
  proyecto: string;
  ubicacion: string;
  imagen: string;
  asignadoOperador: {
    nombre: string;
    cargo: string;
  } | null;
  mensaje?: string;
}