 
import { estadoEquipo } from "../typesScript/equipoFormType";

export type OptionItem = {
  label: string;
  value: string;
};

export const OPCIONES: Record<string, OptionItem[]> = {
  OPCIONES_NIVEL_COMBUSTIBLE: [
    { label: "Vacío", value: "vacio" },
    { label: "1/4", value: "1_4" },
    { label: "1/2", value: "1_2" },
    { label: "3/4", value: "3_4" },
    { label: "Lleno", value: "lleno" },
  ],
};

export const EstadoEquipoColor: Record<string, string> = {
  MANTENIMIENTO: "bg-yellow-50 text-yellow-600 border border-yellow-100",
  "EN OBRA": "bg-green-50 text-green-600 border border-green-100",
  DISPONIBLE: "bg-blue-50 text-blue-600 border border-blue-100",
  "FUERA DE LINEA": "bg-red-50 text-red-600 border border-red-100",
};


export const ESTADOS_EQUIPO_OPTIONS = [
  { value: estadoEquipo.DISPONIBLE, label: estadoEquipo.DISPONIBLE, icon: "✅" },
  { value: estadoEquipo.EN_OBRA, label: estadoEquipo.EN_OBRA, icon: "🏗️" },
  { value: estadoEquipo.MANTENIMIENTO, label: estadoEquipo.MANTENIMIENTO, icon: "🔧" },
  { value: estadoEquipo.FUERA_DE_LINEA, label: estadoEquipo.FUERA_DE_LINEA, icon: "🚫" },
] as const;



