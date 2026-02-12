// import type { FormatoPreoperacional } from "../../../typesScript/preoperacionalType";

// interface Props {
//   formatos: FormatoPreoperacional[];
//   onSelect: (formato: FormatoPreoperacional) => void;
// }

// const ListaFormatosPreoperacionales = ({ formatos, onSelect }: Props) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {formatos.map((f) => (
//         <button
//           key={f.id}
//           onClick={() => onSelect(f)}
//           className="bg-white border border-slate-200 rounded-xl p-4 text-left hover:shadow-md transition"
//         >
//           <h3 className="text-sm font-black text-slate-800">
//             {f.nombreFormato}
//           </h3>

//           <p className="text-[11px] text-slate-400 mt-1">
//             Fecha: {f.fechaCreacion}
//           </p>

//           <span
//             className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase
//               ${f.estado === "ACTIVO" && "bg-emerald-100 text-emerald-600"}
//               ${f.estado === "ARCHIVADO" && "bg-rose-100 text-rose-600"}
//             `}
//           >
//             {f.estado}
//           </span>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default ListaFormatosPreoperacionales;