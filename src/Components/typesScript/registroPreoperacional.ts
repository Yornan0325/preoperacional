// import type { FormatoSIG } from "./formatoSIG";

// export interface RegistroPreoperacional {
//   id: string;
//   formatoId: string;
//   versionFormato: string;

//   fecha: string;
//   estado: "BORRADOR" | "PENDIENTE" | "APROBADO" | "RECHAZADO";

//   respuestas: RespuestaModulo[];
//   firmaOperador?: string;
//   firmaCIS?: boolean;
// }

// export interface RespuestaModulo {
//   moduloId: string;
//   items: RespuestaItem[];
// }

// export interface RespuestaItem {
//   itemId: string;
//   ok: boolean;
//   observacion?: string;
// }

// export const formatoPreoperacionalSIG: FormatoSIG = {
//   id: "SIG-PREOP-001",
//   nombre: "Formato Preoperacional Maquinaria",
//   codigoSIG: "SIG-OP-014",
//   version: "01",

//   fechas: {
//     creacion: "2025-01-10",
//     revision: "2025-01-10",
//     actualizacion: "2025-01-10",
//   },

//   numeralSIG: "7.1.5",

//   modulos: [
//     {
//       id: "MOD-01",
//       nombre: "Horómetro y Combustible",
//       items: [
//         { id: "H01", nombre: "Horómetro Inicio", obligatorio: true },
//         { id: "H02", nombre: "Horómetro Fin", obligatorio: true },
//         { id: "H03", nombre: "Nivel ACPM Inicio", obligatorio: true },
//         { id: "H04", nombre: "Nivel ACPM Fin", obligatorio: true },
//         { id: "H05", nombre: "Tanqueo (Galones)", obligatorio: false },
//       ],
//     },
//     {
//       id: "MOD-02",
//       nombre: "Motor y Sistema Hidráulico",
//       items: [
//         { id: "M01", nombre: "Nivel aceite motor", obligatorio: true },
//         { id: "M02", nombre: "Nivel combustible", obligatorio: true },
//         { id: "M03", nombre: "Nivel refrigerante", obligatorio: true },
//         { id: "M04", nombre: "Mangueras hidráulicas", obligatorio: true },
//       ],
//     },
//     {
//       id: "MOD-03",
//       nombre: "Estado Mecánico General",
//       items: [
//         { id: "E01", nombre: "Cilindros hidráulicos", obligatorio: true },
//         { id: "E02", nombre: "Llantas", obligatorio: true },
//         { id: "E03", nombre: "Sistema eléctrico", obligatorio: true },
//         { id: "E04", nombre: "Aseo general", obligatorio: false },
//       ],
//     },
//   ],
// };