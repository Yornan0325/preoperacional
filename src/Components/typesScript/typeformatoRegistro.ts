// export type FieldType =
//   | "text"
//   | "boolean"
//   | "number"
//   | "options"
//   | "email"
//   | "password"
//   | "date"
//   | "time"
//   | "color"
//   | "file"
//   | "datetime";
  

// Tipos de campo permitidos
// export type TipoCampo =
//   | 'boolean'
//   | 'text'
//   | 'number'
//   | 'select'
//   | 'radio'
//   | 'checkbox'
//   | 'date'
//   | 'time'
//   | 'datetime';

// // Nivel de combustible
// export type NivelCombustible =
//   | 'vacio'
//   | '1/4'
//   | '1/2'
//   | '3/4'
//   | 'lleno';


// export type OptionItem = {
//   label: string;
//   value: string;
// };

// export type OptionType = "radio" | "checkbox" | "select" | "options";
// export type PredefinedKey = "NIVEL_COMBUSTIBLE";


// export interface FieldConfig {
//   id: string;
//   nombre?: string;
//   type: FieldType;
//   label?: string;
//   // solo si type === "options"
//   optionType?: OptionType;
//   hasOptions?: boolean;
//   optionsSource?: "manual" | "predefined";
//   predefinedKey?: PredefinedKey;
//   options?: OptionItem[];
//   value?: any;
// }

// Estado real de un check de inspección
// export interface EstadoCheck {
//   ok: boolean;
//   observacion?: string;
// }


// export type ValorCampo =
//   | string
//   | number
//   | null
//   | string[]
//   | boolean;
// Campos


// export interface Campo {
//   id: string;
//   nombre: string;
//   type: FieldType;
//   optionType?: OptionType;
//   optionsSource?: "manual" | "predefined";
//   predefinedKey?: PredefinedKey;
//   options?: OptionItem[];
//   value: ValorCampo;
// }



// export interface Campo {
//   id: string;
//   nombre: string;
//   type: FieldType;
//   optionType?: OptionType;
//   optionsSource?: "manual" | "predefined";
//   predefinedKey?: PredefinedKey;
//   options?: OptionItem[];
//   value: ValorCampo;
// }
// Módulo (sección)
// export interface Modulo {
//   id: string;
//   nombre: string;
//   campos: Campo[];
// }


// 📘 Plantilla (qué se debe inspeccionar)
// export interface FormatoInspeccion {
//   id?: string;
//   nombreFormato: string;
//   tipoEquipo?: string;
//   version: number;
//   modulos: Modulo[];
//   createdAt?: string;
// }
// export interface CampoPersonalizado {
//   id: string;
//   nombre: string;
//   tipo: TipoCampo;
//   valor: any;
// }

// 📝 Registro (lo que llena el operador)
// export interface RegistroEquipo {
//   id?: string;
//   equipoId: string;
//   operadorId: string;
//   formatoId: string;
//   fecha: string;
//   datos: Modulo[];
//   acpmInicio: NivelCombustible;
//   acpmFin: NivelCombustible;
//   observacionesGenerales?: string;
// }

