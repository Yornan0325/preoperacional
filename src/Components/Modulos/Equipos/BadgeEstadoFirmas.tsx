// const BadgeEstadoFirmas = ({ inspector, siso, copas }: any) => {
//     const total = [inspector, siso, copas].filter(Boolean).length;
    
//     return (
//         <div className="flex flex-col gap-1">
//             <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                 <div 
//                     className={`h-full transition-all ${total === 3 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
//                     style={{ width: `${(total / 3) * 100}%` }}
//                 />
//             </div>
//             <span className="text-[9px] font-black uppercase text-slate-500">
//                 {total}/3 Firmas (Siso, Insp, Copas)
//             </span>
//         </div>
//     );
// };

// export default BadgeEstadoFirmas;



const BadgeEstadoFirmas = ({ inspector, siso, copas }: any) => {
    const total = [inspector, siso, copas].filter(Boolean).length;
    
    return (
        <div className="flex flex-col gap-1">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all ${total === 3 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                    style={{ width: `${(total / 3) * 100}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>I</span>
                <span>S</span>
                <span>C</span>
            </div>
        </div>
    );
};
export default BadgeEstadoFirmas;