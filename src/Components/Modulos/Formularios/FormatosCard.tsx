import {FileText, Trash2 } from "lucide-react";
import type { FormatoSIG } from "../../typesScript/preoperacionalType";

interface Props {
  formato: FormatoSIG;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => void;
}

const FormatoCard = ({ formato, onEdit, onDelete }: Props) => {


  return (
    <div
     
      className="  rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition group"
    >
      <div className="flex items-center gap-3 mb-2 cursor-pointer" onClick={() => onEdit(formato.id)}>
        <div className="p-2 bg-blue-50 rounded-lg  transition">
          <FileText className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-1">{formato.nombreFormato}</h3>
          <p className="text-xs font-medium text-slate-500">{formato.codigoSIG}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider font-bold">
          v{formato.version}
        </span>
        <button
          onClick={() => onDelete?.(formato.id)}
          className="text-xs text-blue-400 font-medium group-hover:text-blue-800 cursor-pointer">
         <div className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
          <Trash2 size={14} />
        </div>
        </button>
        {/* <span className="text-xs text-blue-600 font-medium">Ver formato →</span> */}
      </div>
    </div>
  );
};

export default FormatoCard
// import type { FormatoCompleto } from '../../typesScript/preoperacionalType';
// import { FileEdit, Trash2,  ClipboardList } from 'lucide-react';

// interface Props {
//   formato: FormatoSIG;
//   onEdit: (id: string) => void;
//   onDelete?: (id: string) => void;
// }

// export const FormatoCard = ({ formato, onEdit, onDelete }: Props) => {
//   return (
//     <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-500 transition-all duration-300">
//       <div className="p-5">
//         <div className="flex justify-between items-start mb-4">
//           <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
//             <ClipboardList size={20} />
//           </div>
//           <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">
//             Ver. {formato.version}
//           </span>
//         </div>

//         <h3 className="text-sm font-black text-slate-800 uppercase line-clamp-2 mb-4 h-10 tracking-tight">
//           {formato.nombreFormato}
//         </h3>

//         <div className="space-y-2 border-t border-slate-50 pt-4">
//           <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
//             <Hash size={12} className="text-slate-300" />
//             <span className="uppercase">{formato.numeralSIG || 'Sin Código'}</span>
//           </div>
//           <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
//             <Calendar size={12} className="text-slate-300" />
//             <span>Actualizado: {formato.fechaActualizacion}</span>
//           </div>
//         </div>
//       </div>

//       <div className="flex border-t border-slate-100">
//         <button
//           onClick={() => onEdit(formato.id)}
//           className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
//         >
//           <FileEdit size={14} /> Editar
//         </button>
//         <button
//           onClick={() => onDelete?.(formato.id)}
//           className="px-4 py-3 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors border-l border-slate-100"
//         >
//           <Trash2 size={14} />
//         </button>
//       </div>
//     </div>
//   );
// };