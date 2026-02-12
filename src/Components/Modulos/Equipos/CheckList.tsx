// import {
//   ChevronLeft,
//   HelpCircle,
//   CheckSquare,
//   X
// } from 'lucide-react';
// // import { useStepsStore } from '../../Store/useStepsStore';
 
// const CheckList = () => {
//     // const { step, maxSteps, nextStep, prevStep, canGoNext, canGoPrev } = useStepsStore();
  
//   // Datos estáticos basados en tu imagen 01, 02 y 03
//   const sections = [
//     {
//       id: 4,
//       title: '04. KILOMETRAJE Y COMBUSTIBLE',
//       items: [
//         { id: 'k1', label: 'Kilometraje inicio día', type: 'number', value: 0 },
//         { id: 'k2', label: 'Kilometraje fin día', type: 'number', value: 0 },
//         { id: 'k3', label: 'Tanqueo combustible (gal)', type: 'number', value: 0 },
//         { id: 'k4', label: 'Kilometraje en tanqueo', type: 'number', value: 0 },
//         { id: 'a1', label: 'ACPM inicio día', type: 'select', options: ['vacio', '1/4', '1/2', '3/4', 'lleno'] },
//         { id: 'a2', label: 'ACPM fin día', type: 'select', options: ['vacio', '1/4', '1/2', '3/4', 'lleno'] }
//       ]
//     },
//     {
//       id: 1,
//       title: '01. SISTEMA DE MOTOR',
//       items: [
//         { id: 'm1', label: 'Niveles de Aceite', value: 'B', type: 'select' },
//         { id: 'm2', label: 'Fugas de Combustible', value: null, type: 'select' },
//       ]
//     },
//     {
//       id: 2,
//       title: '02. SISTEMA ELÉCTRICO',
//       items: [
//         { id: 'e1', label: 'Estado de Baterías', value: null, type: 'select' },
//         { id: 'e2', label: 'Luces y Alarmas', value: null, type: 'select' },
//       ]
//     },
//     {
//       id: 3,
//       title: '03. ESTRUCTURA Y CHASIS',
//       items: [
//         { id: 'c1', label: 'Pasadores y Seguros', value: null, type: 'select' },
//       ]
//     }

//   ];

//   return (
//     <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">

//       {/* HEADER - Identico a imagen 2 */}
//       <header className="px-6 py-4 flex items-center justify-between bg-white relative">
//         <button className="text-slate-400 hover:text-slate-600">
//           <ChevronLeft size={32} strokeWidth={1.5} />
//         </button>
//         <div className="text-center">
//           <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-0.5">Paso 2 de 4</p>
//           <h1 className="text-[13px] font-black text-slate-900 uppercase">Evaluación</h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Check-list de Evaluación Técnica</p>
//         </div>
//         <button className="bg-rose-500 rounded-full p-1">
//           <HelpCircle size={20} className="text-white" fill="currentColor" />
//         </button>
//         {/* Progress bar line */}
//         <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
//           <div className="w-1/2 h-full bg-rose-500"></div>
//         </div>
//       </header>

//       <main className="flex-1 p-6 space-y-8 max-w-lg mx-auto w-full">
//         {/* Title Section */}
//         <section className="mt-4">
//           <h2 className="text-[26px] font-black text-slate-900 leading-none">Check-list de Inspección</h2>
//           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Estado General del Equipo</p>
//         </section>
       
//           <div className="bg-orange-50/50 px-8 py-4 border-b border-orange-100 flex items-center gap-2">
//             <h3 className="text-orange-600 font-black text-sm uppercase tracking-wider">
//               04. KILOMETRAJE Y COMBUSTIBLE
//             </h3>
//           </div>

//           <div className="p-2 space-y-6">
//             {/* Leyenda de estado rápido */}
//             <div className="flex gap-4 mb-4 text-[10px] font-bold uppercase text-slate-400 italic">
//               <span className="flex items-center gap-1"><X size={12} className="text-rose-500" /> Mal estado</span>
//               <span className="flex items-center gap-1"><CheckSquare size={12} className="text-emerald-500" /> Buen estado</span>
//             </div>

//             {/* Renderizado de Inputs Numéricos con estilo de la Imagen 1 */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {[
//                 { id: 'k1', label: 'KILOMETRAJE INICIO DÍA' },
//                 { id: 'k2', label: 'KILOMETRAJE FIN DÍA' },
//                 { id: 'k3', label: 'TANQUEO COMBUSTIBLE (GAL)' },
//                 { id: 'k4', label: 'KILOMETRAJE EN TANQUEO' }
//               ].map((field) => (
//                 <div key={field.id} className="relative">
//                   <label className="text-[10px] font-black text-slate-400 mb-1 block">{field.label}</label>
//                   <input
//                     type="number"
//                     placeholder="0"
//                     className="w-full bg-slate-50 border-b-2 border-slate-200 focus:border-orange-500 py-3 px-4 rounded-t-xl outline-none font-bold text-slate-700 transition-all"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Selectores de ACPM estilo Imagen 4 */}
//             <div className="grid grid-cols-2 gap-4 pt-4">
//               <div>
//                 <label className="text-[10px] font-black text-slate-400 mb-2 block">ACPM INICIO DÍA</label>
//                 <select className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-orange-500 transition-all appearance-none">
//                   <option value="vacio">vacio</option>
//                   <option value="lleno">lleno</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] font-black text-slate-400 mb-2 block">ACPM FIN DÍA</label>
//                 <select className="w-full bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:border-orange-500 transition-all appearance-none">
//                   <option value="vacio">vacio</option>
//                   <option value="lleno">lleno</option>
//                 </select>
//               </div>
//             </div>
//           </div>
      
//         {/* Dynamic Sections Render */}
//         {sections.map((section) => (
//           <div key={section.id} className="space-y-6">
//             <h3 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.15em] border-b border-rose-50 pb-2">
//               {section.title}
//             </h3>

//             <div className="space-y-7">
//               {section.items.map((item) => (
//                 <div key={item.id} className="flex items-center justify-between group">
//                   <span className="text-[16px] font-bold text-slate-700 tracking-tight">
//                     {item.label}
//                   </span>

//                   {/* Selector B / M / N/A - Estilo Imagen 2 */}
//                   <div className="flex gap-3">
//                     {['B', 'M', 'N/A'].map((opt) => (
//                       <button
//                         key={opt}
//                         className={`w-10 h-10 rounded-full border-[1.5px] text-[11px] font-black transition-all flex items-center justify-center
//                           ${item.value === opt && opt === 'B'
//                             ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100'
//                             : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'
//                           }
//                         `}
//                       >
//                         {opt}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Toolbar de agregar (Tu requerimiento de diseño dinámico) */}
//             {/* <div className="flex justify-center gap-4 py-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-4">
//               <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><List size={20}/></button>
//               <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><CheckSquare size={20}/></button>
//               <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Hash size={20}/></button>
//               <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Type size={20}/></button>
//               <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Radius size={20}/></button>
//             </div> */}
//           </div>
//         ))}
//       </main>

//       {/* Footer Fijo - Identico a imagen 2 */}
//       <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-50 flex justify-end">
//         {/* <button
//           type="submit"
//           className="group flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 text-white px-12 py-4 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 w-full md:w-auto justify-center"
//           disabled={!canGoNext() || !isValid} // Deshabilitar si no hay siguiente paso o el formulario no es válido
//         >
//           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Siguiente sección</span>
//           <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </button> */}
//       </footer>
//     </div>
//   );
// };

// export default CheckList;