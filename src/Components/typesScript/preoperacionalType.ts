
// export type NivelCombustible = 'vacio' | '1/4' | '1/2' | '3/4' | 'lleno';
// export type ValorCampo = boolean | string | number | NivelCombustible | null;
// export type TipoCampo = 'boolean' | 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime' | 'datetime-local' | 'month' | 'week' | 'year' | 'color' | 'email' | 'tel' | 'url' | 'password' | 'file';

// export interface Campo {
//   id: string;
//   nombre: string;
//   tipo: TipoCampo;
//   valor: ValorCampo;
//   requerido?: boolean;
//   opciones?: string[]; // para select, radio, checkbox
//   observacion?: string; // CLAVE para preoperacional
// }
// export interface EstadoCheck {
//   ok: boolean;
//   observacion?: string;
// }
// export interface Modulo { id: string; nombre: string; campos: Campo[]; }
// export interface FormatoInspeccion { nombreFormato: string; modulos: Modulo[]; }
// export interface CampoPersonalizado { id: string; nombre: string; tipo: TipoCampo; valor: any; }

export interface ItemChecklist {
  id?: string;
  horometroyCombustible: {
    horometroInicio: number;
    horometroFin: number;
    tanqueoGalones: number;
    horometroTanqueo: number;
    acpmInicio: NivelCombustible;
    acpmFin: NivelCombustible;
  };
  motoryBombaBombaHidraulica: {
    nivelAceiteMotor: EstadoCheck;
    nivelCombustible: EstadoCheck;
    nivelRefrigerante: EstadoCheck;
    nivelAceiteHidraulico: EstadoCheck;
    manguerasHidraulicas: EstadoCheck;
    acoplesUnionesHidraulicos: EstadoCheck;
    bombaHidraulica: EstadoCheck;
    filtroAceiteMotor: EstadoCheck;
    filtroAire: EstadoCheck;
    filtroCombustible: EstadoCheck;
    filtroAceiteHidraulico: EstadoCheck;
  };
  estadoMecanico: {
    cilindrosHidraulicos: EstadoCheck;
    graseras: EstadoCheck;
    estadoGeneralMandosControl: EstadoCheck;
    indicadoresManometros: EstadoCheck;
    tuboEscape: EstadoCheck;
    tableroLectura: EstadoCheck;
    bateriaySistemaElectrico: EstadoCheck;
    tolvaTornillosFijacionyEmpaque: EstadoCheck;
    estadoLlantas: EstadoCheck;
    aseoGeneralLatoneriayPintura: EstadoCheck;
    funcionamientoGeneral: EstadoCheck;
  };
}

//Registro de preoperacionales
export interface PreoperacionalRegistro {
  id: string;
  equipoId: string;
  fecha: string; // YYYY-MM-DD
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  formato: ItemChecklist;
}

export type FormatoPreoperacional = {
  id: string;
  nombreFormato: string;
  version: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaRevision: string;
  numeralSIG: string;
  estado: EstadoFormato;
  checklist: any[];
  modulos?: any[];
  observaciones: string;
};

export interface FormatoSIG extends FormatoPreoperacional {
  codigoSIG?: string;
}


// ============================================
// TIPOS BASE
// ============================================

export type NivelCombustible = 'vacio' | '1/4' | '1/2' | '3/4' | 'lleno';

export type EstadoPreoperacional = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export type EstadoFormato = 'ACTIVO' | 'INACTIVO' | 'ARCHIVADO';

export type TipoCampo =
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'textarea'
  | 'nivel-combustible'
  | 'file';

export type ValorCampo =
  | boolean
  | string
  | number
  | NivelCombustible
  | null
  | undefined;

// ============================================
// 1. FORMATO (Paso 1: /formulario/formatos)
// ============================================

/**
 * Información general del formato
 * Se crea en PaginaDeFormatosForm (StepOne)
 */
export interface FormatoGeneral {
  id: string; // Generado en BD
  nombreFormato: string; // "EXCAVADORA DE ORUGAS"
  version: string; // "1.0"
  fechaCreacion: string; // ISO
  fechaActualizacion: string; // ISO
  fechaRevision?: string;
  numeralSIG: string; // "2040"
  tipoEquipo?: string; // Para filtrar equipos compatibles
  estado: EstadoFormato;
  creadoPor?: string; // userId
}

// ============================================
// 2. CHECKLIST (Paso 2: /formatos/:id)
// ============================================

/**
 * Campo individual del checklist
 */
export interface CampoChecklist {
  id: string; // Único, ej: "horometro_inicio"
  nombre: string; // "Horómetro Inicio"
  tipo: TipoCampo;
  requerido: boolean;
  placeholder?: string;
  opciones?: string[]; // Para select/radio
  valorPorDefecto?: ValorCampo;

  // Validaciones
  min?: number;
  max?: number;
  patron?: string; // regex como string

  // Ayuda
  ayuda?: string; // Texto de ayuda
}

/**
 * Sección/Módulo del checklist
 */
export interface SeccionChecklist {
  items: any;
  id: string; // "horometro_combustible"
  nombre: string; // "Horómetro y Combustible"
  orden: number; // Para ordenar secciones
  campos: CampoChecklist[];
  descripcion?: string;
}

/**
 * Checklist completo del formato
 * Se configura en PaginaFormatoPreoperacional (StepTwo)
 */
export interface ChecklistFormato {
  formatoId: string; // Relación con FormatoGeneral
  secciones: SeccionChecklist[];
  observacionesGenerales?: string; // Instrucciones
}

// ============================================
// 3. FORMATO COMPLETO (Pasos 1 + 2)
// ============================================

/**
 * Combinación de FormatoGeneral + ChecklistFormato
 * Este es el modelo completo que se guarda en BD
 */
export interface FormatoCompleto extends FormatoGeneral {
  checklist: SeccionChecklist[]; // Del ChecklistFormato
  observaciones?: string;
}

// ============================================
// 4. EQUIPO (Paso 3: /formulario/equipos)
// ============================================

/**
 * Información del equipo
 * Se crea en PaginaDeEquiposForm
 */
export interface Equipo {
  id?: string;

  // Relaciones
  formatoId: string; // A qué formato pertenece

  // Identificación
  relacionEquipo: string; // "VEHÍCULO LIVIANO"
  placa: string;
  marca: string;
  modelo: string;
  serial: string;

  // Ubicación y asignación
  proyecto: string;
  ubicacion: string;
  asignadoOperador?: string;

  // Estado
  estado: 'OPERATIVA' | 'PENDIENTE' | 'MANTENIMIENTO' | 'FUERA_DE_SERVICIO';

  // Metadata
  fechaRegistro?: string;
  registradoPor?: string;
  activo: boolean;
}

// ============================================
// 5. INSPECCIÓN PREOPERACIONAL (Paso 5)
// ============================================

/**
 * Respuesta a un campo específico
 */
export interface RespuestaCampo {
  campoId: string;
  valor: ValorCampo;
  observacion?: string; // Observación específica del campo
  evidenciaFoto?: string; // URL de foto si aplica
}

/**
 * Estado de verificación con observaciones
 * (Para campos tipo boolean con observaciones)
 */
export interface EstadoCheck {
  ok: boolean;
  observacion?: string;
}

/**
 * Registro de inspección preoperacional
 * Se crea en PaginaPreoperacional
 */
export interface InspeccionPreoperacional {
  id?: string;

  // Relaciones
  equipoId: string;
  formatoId: string; // Para saber qué checklist usar

  // Quién y cuándo
  operadorId: string;
  operadorNombre?: string; // Desnormalizado para reportes
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin?: string; // HH:mm

  // Respuestas del checklist
  // { campoId: { valor, observacion, evidencia } }
  respuestas: Record<string, RespuestaCampo>;

  // Estado y aprobación
  estado: EstadoPreoperacional;
  observacionesGenerales?: string;
  fotosGenerales?: string[]; // URLs

  // Aprobación
  aprobadoPor?: string;
  aprobadoPorNombre?: string;
  fechaAprobacion?: string;
  motivoRechazo?: string;

  // Metadata
  ubicacion?: string; // GPS o texto
  creadoEn: string; // timestamp
}

export type Preoperacional = InspeccionPreoperacional;

// ============================================
// 6. TIPOS AUXILIARES PARA LA UI
// ============================================

/**
 * Para el formulario de creación de formatos
 * (StepOneFormato)
 */
export interface FormatoFormData {
  nombreFormato: string;
  version: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  fechaRevision?: string;
  numeralSIG: string;
}

/**
 * Para el formulario de equipos
 * (StepOneEquipoForm)
 */
export interface EquipoFormData {
  relacionFormato: string; // formatoId
  relacionEquipo: string;
  placa: string;
  marca: string;
  modelo: string;
  serial: string;
  proyecto: string;
  ubicacion: string;
  asignadoOperador: string;
  estado: string;
}

/**
 * Para edición de checklist
 * (StepTwoFormato)
 */
export interface ChecklistFormData {
  secciones: SeccionChecklist[];
}

/**
 * Para el formulario de inspección
 * (PaginaPreoperacional)
 */
export interface InspeccionFormData {
  fecha: string;
  horaInicio: string;
  horaFin?: string;
  respuestas: Record<string, ValorCampo>;
  observacionesCampos: Record<string, string>;
  observacionesGenerales?: string;
}

// ============================================
// 7. TIPOS PARA STORES (ZUSTAND)
// ============================================

/**
 * Store de Formatos
 */
export interface FormatoStore {
  // Estado
  formatos: FormatoCompleto[];
  formatoActual: FormatoCompleto | null;
  cargando: boolean;

  // Acciones
  cargarFormatos: () => Promise<void>;
  crearFormato: (formato: FormatoGeneral) => Promise<string>; // Retorna ID
  actualizarFormato: (id: string, datos: Partial<FormatoCompleto>) => Promise<void>;
  eliminarFormato: (id: string) => Promise<void>;
  obtenerFormato: (id: string) => Promise<FormatoCompleto | null>;

  // Checklist
  actualizarChecklist: (formatoId: string, checklist: SeccionChecklist[]) => Promise<void>;
}

/**
 * Store de Equipos
 */
export interface EquipoStore {
  equipos: Equipo[];
  equipoActual: Equipo | null;
  cargando: boolean;

  crearEquipo: (equipo: Equipo) => Promise<string>;
  actualizarEquipo: (id: string, datos: Partial<Equipo>) => Promise<void>;
  eliminarEquipo: (id: string) => Promise<void>;
  obtenerEquipo: (id: string) => Promise<Equipo | null>;
  obtenerEquiposPorFormato: (formatoId: string) => Promise<Equipo[]>;
}

/**
 * Store de Inspecciones
 */
export interface InspeccionStore {
  inspecciones: InspeccionPreoperacional[];
  inspeccionActual: InspeccionPreoperacional | null;
  cargando: boolean;

  crearInspeccion: (inspeccion: InspeccionPreoperacional) => Promise<string>;
  actualizarInspeccion: (id: string, datos: Partial<InspeccionPreoperacional>) => Promise<void>;
  aprobarInspeccion: (id: string, aprobadoPor: string) => Promise<void>;
  rechazarInspeccion: (id: string, motivo: string, rechazadoPor: string) => Promise<void>;
  obtenerInspeccionesPorEquipo: (equipoId: string, desde?: string, hasta?: string) => Promise<InspeccionPreoperacional[]>;
}

// ============================================
// 8. CONSTANTES ÚTILES
// ============================================

export const NIVELES_COMBUSTIBLE = [
  { value: 'vacio' as const, label: 'Vacío', porcentaje: 0 },
  { value: '1/4' as const, label: '1/4', porcentaje: 25 },
  { value: '1/2' as const, label: '1/2', porcentaje: 50 },
  { value: '3/4' as const, label: '3/4', porcentaje: 75 },
  { value: 'lleno' as const, label: 'Lleno', porcentaje: 100 },
] as const;

export const ESTADOS_EQUIPO = [
  'OPERATIVA',
  'PENDIENTE',
  'MANTENIMIENTO',
  'FUERA_DE_SERVICIO'
] as const;

export const TIPOS_CAMPO_LABELS: Record<TipoCampo, string> = {
  text: 'Texto',
  number: 'Número',
  boolean: 'Sí/No',
  select: 'Lista',
  radio: 'Opción única',
  checkbox: 'Casilla',
  date: 'Fecha',
  time: 'Hora',
  textarea: 'Texto largo',
  'nivel-combustible': 'Nivel de combustible',
  file: 'Archivo',
};


