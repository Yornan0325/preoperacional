
export type ItemType = 'select' | 'checkbox' | 'number' | 'text';

export type StatusValue = string | number | boolean | null;

// export interface Asignado {
//   nombre: string;
//   cargo: string;
// }
export interface ChecklistItem {
    id: string;
    label: string;
    type: ItemType;
    value: any;
    options?: string[]; // Solo para tipo 'select' (ej: ['B', 'M', 'NA'])
}

export interface Section {
    id: number;
    title: string;
    items: ChecklistItem[];
}

export type StepTwoForm = {
    title: string;
    values: Record<string, any>;
};
export interface InspectionItem {
    pregunta: string;
    tipo: ItemType;
    valor_ingresado: any;
}
export interface InspectionSection {
    seccion: string;
    items: InspectionItem[];
}
export interface InspectionPayload {
    formato: string;
    createdFormat: string;
    estado: string;
    datos_equipo: any; // Define este tipo según tu generalData
    inspeccion_tecnica: InspectionSection[];
}
// Tipos para los botones de la toolbar
export interface ToolbarButton {
    icon: React.ComponentType<{ size?: number }>;
    type: ItemType;
    label: string;
}
export interface FormatoFormState {
    checklist: Section[];
    checklistTitle: string;
    generalData: any; // Define según tus necesidades

    addItemToSection: (sectionId: number, label: string, type: ItemType) => void;
    addSection: (title: string) => void;
    updateItemLabel: (sectionId: number, itemId: string, newLabel: string) => void;
    removeItem: (sectionId: number, itemId: string) => void;
    removeSection: (sectionId: number) => void;
}
export const estadoEquipo = {
    MANTENIMIENTO: 'MANTENIMIENTO',
    EN_OBRA: 'EN OBRA',
    DISPONIBLE: 'DISPONIBLE',
    FUERA_DE_LINEA: 'FUERA DE LINEA',
} as const;

// export type estadoEquipo = (typeof estadoEquipo)[keyof typeof estadoEquipo];
// export type EstadoEquipo = estadoEquipo;

// export interface Equipo {
//   id: string;
//   nombre: string;
//   placa: string;
//   marca: string;
//   modelo: string;
//   serial: string;
//   relacionFormato: string;
//   estado: estadoEquipo;
//   proyecto: string;
//   ubicacion: string;
//   imagen: string;
//   asignadoOperador: {
//     nombre: string;
//     cargo: string;
//   } | null;
//   mensaje?: string;
// }





