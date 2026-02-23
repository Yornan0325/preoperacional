// import { UseFormRegister } from "react-hook-form";

import type { UseFormRegister } from "react-hook-form";

export const EditorHeader = ({ register }: { register: UseFormRegister<any> }) => (
    <div className="w-full mb-12 bg-white border-2 border-black rounded-md overflow-hidden shadow-sm flex flex-col md:flex-row">
        {/* LOGO */}
        <div className="md:w-1/4 border-b-2 md:border-b-0 md:border-r-2 border-black bg-slate-50 flex items-center justify-center p-6">
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Logo Empresa</span>
        </div>

        {/* TÍTULO */}
        <div className="flex-1 border-b-2 md:border-b-0 md:border-r-2 border-black p-4 flex items-center">
            <textarea
                {...register("nombreFormato")}
                rows={2}
                className="w-full text-center font-black uppercase text-lg outline-none focus:bg-yellow-50 resize-none"
                placeholder="NOMBRE DEL FORMATO"
            />
        </div>

        {/* INFO TÉCNICA */}
        <div className="md:w-1/3 flex bg-white">
            <div className="flex-1 border-r-2 border-black p-3 space-y-2">
                {["version", "fechaCreacion", "fechaActualizacion"].map((field) => (
                    <div key={field}>
                        <label className="block text-[8px] font-black text-slate-400 uppercase text-center">{field}</label>
                        <input {...register(field)} className="w-full border-b border-slate-200 text-center font-bold text-[11px] outline-none uppercase focus:border-black" />
                    </div>
                ))}
            </div>
            <div className="w-24 bg-slate-50 p-3 flex flex-col justify-center items-center text-center">
                <label className="text-[8px] font-black text-slate-400 uppercase mb-1">CÓDIGO SIG</label>
                <input {...register("numeralSIG")} className="w-full text-center text-[11px] font-black bg-transparent outline-none border-b-2 border-dashed border-black" />
            </div>
        </div>
    </div>
);