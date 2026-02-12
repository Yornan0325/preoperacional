// import { Check } from 'lucide-react';
// import { useInspectionStore } from '../Store/useInspectionStore';

// const Stepper = () => {
//   const step = useInspectionStore((state: { step: any; }) => state.step);
//   const steps = [
//     { id: 1, label: 'Data' },
//     { id: 2, label: 'Lista' },
//   ];

//   return (
//     <div className="w-full py-4 px-6 bg-white border-b border-slate-100">
//       <div className="flex items-center justify-between relative max-w-xs mx-auto">
//         {/* Línea de fondo */}
//         <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />

//         {/* Línea de progreso activa */}
//         <div
//           className="absolute top-1/2 left-0 h-0.5 bg-rose-500 -translate-y-1/2 transition-all duration-500"
//           style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
//         />

//         {steps.map((s) => (
//           <div key={s.id} className="relative z-10 flex flex-col items-center">
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step >= s.id
//                   ? 'bg-rose-500 text-white ring-4 ring-rose-50'
//                   : 'bg-white border-2 border-slate-200 text-slate-400'
//                 }`}
//             >
//               {step > s.id ? <Check size={14} strokeWidth={3} /> : s.id}
//             </div>
//             <span className={`text-[10px] mt-1 font-bold uppercase tracking-tighter ${step >= s.id ? 'text-rose-600' : 'text-slate-400'
//               }`}>
//               {s.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Stepper;