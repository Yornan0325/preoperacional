

export const estadoEquipo = {
  MANTENIMIENTO: 'MANTENIMIENTO',
  EN_OBRA: 'EN OBRA',
  DISPONIBLE: 'DISPONIBLE',
  FUERA_DE_LINEA: 'FUERA DE LINEA',
} as const;

export type estadoEquipo = (typeof estadoEquipo)[keyof typeof estadoEquipo];
export type EstadoEquipo = estadoEquipo;

export interface StaffMemberType {
    cedula: string;
    fullName: string;
    cargo?: string;
}


export interface Equipo {
  nombreEquipo: any;
  id: string;
  placa: string;
  serial: string;
  relacionFormato: string;
  marca: string;
  estado: estadoEquipo;
  proyecto: string;
  ubicacion: string;
  imagen: string;
  asignadoOperador: {
    nombre: string;
    cargo: string;
  } | null;
  // documento de staff identificado por número de cédula
  asignadoOperadorCedula?: string;
  mensaje?: string;
  // Fechas de vencimiento y documentación
  vencimientoExtintor?: string; // ISO date YYYY-MM-DD
  vencimientoSOAT?: string; // ISO date
  vencimientoTecnoMecanica?: string; // ISO date
  otros?: Record<string, any>;
}