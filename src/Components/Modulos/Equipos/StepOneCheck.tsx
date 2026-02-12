import {
    ChevronLeft,
    HelpCircle,
    ChevronRight,
    X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useFormatoFormStore } from '../../Store/FormatoStore/useFormatoFormStore';
import { useStepsStore } from '../../Store/useStepsStore';
import { usePreoperacionalStore } from '../../Store/usePreoperacionalStore';
import { useMemo } from 'react';

// 1. Definición exacta de tu tipo de formulario
type StepOneForm = {
    horometroInicioDia: number;
    horometroFinDia: number;
    tanqueoCombustible: number;
    horometroTanqueo: number;
    acpmInicioDia: string;
    acpmFinDia: string;
};

const StepOneCheck = ({ formato, datosPrevios }: { formato: any, datosPrevios: any }) => {
    const { updateFormatoGeneral } = useFormatoFormStore();
    const { step, maxSteps, nextStep, prevStep, canGoPrev } = useStepsStore();
    const { fecha } = usePreoperacionalStore();

    // Buscamos la sección en el JSON del equipo
    const seccionGeneral = formato?.checklist?.find((s: any) => s.id === "horometro") || { nombre: "Información General" };
    console.log(seccionGeneral);
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<StepOneForm>({
        mode: 'onChange',
        defaultValues: datosPrevios?.generalData || {},
    });
const fechaIso = useMemo(() =>
    fecha ? fecha.toLocaleDateString("es-CO") : null
    , [fecha]);
    const onSubmit = (data: StepOneForm) => {
        updateFormatoGeneral(data); // Guarda en el store global
        nextStep(); // Pasa al checklist (Step 2)
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 w-full">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="min-h-screen m-4 border border-slate-200 rounded-lg overflow-hidden flex flex-col font-sans text-slate-900"
            >
                {/* HEADER */}
                <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-slate-50 sticky top-0 z-50">
                    <button
                        type="button"
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                        onClick={() => canGoPrev() ? prevStep() : null}
                    >
                        {canGoPrev() ? <ChevronLeft size={24} /> : <X size={24} />}
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-0.5">
                            Paso {step} / {maxSteps}
                        </h1>
                    </div>

                    <button type="button" className="text-rose-500/40 hover:text-rose-500 transition-colors">
                        <HelpCircle size={20} />
                    </button>

                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
                        <div
                            className="h-full bg-rose-600 transition-all duration-500"
                            style={{ width: `${(step / maxSteps) * 100}%` }}
                        ></div>
                    </div>
                </header>

                <main className="flex-1 w-full">
                    {/* SECCIÓN HERO */}
                    <section className="px-6 py-10 md:px-12 bg-slate-50/30">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Información</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Seleccionada: {fechaIso}</p>
                    </section>

                    <div className="px-6 md:px-12 py-10 space-y-16">
                        <section className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black text-orange-600 bg-orange-100 px-2 py-1 rounded">01</span>
                                <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">{seccionGeneral.nombre}</h3>
                                <div className="h-[1px] flex-1 bg-slate-100"></div>
                            </div>

                            {/* GRID DE INPUTS NUMÉRICOS (Los 4 horómetros/tanqueo) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
                                {[
                                    { id: 'horometroInicioDia', label: 'Horómetro Inicio' },
                                    { id: 'horometroFinDia', label: 'Horómetro Fin' },
                                    { id: 'tanqueoCombustible', label: 'Tanqueo (Gals)' },
                                    { id: 'horometroTanqueo', label: 'Horómetro Tanqueo' },
                                ].map((item) => (
                                    <div key={item.id} className="group flex flex-col">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-orange-500 transition-colors">
                                            {item.label}
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="0"
                                            {...register(item.id as keyof StepOneForm, { required: true })}
                                            className="text-2xl font-light text-slate-500 placeholder:text-slate-200 outline-none bg-transparent border-b border-slate-300 focus:border-orange-500 pb-3 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* SELECTORES DE ACPM (Los 2 selects) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                                {[
                                    { id: 'acpmInicioDia', label: 'ACPM Inicio Día' },
                                    { id: 'acpmFinDia', label: 'ACPM Fin Día' },
                                ].map((select) => (
                                    <div key={select.id} className="flex flex-col group">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-orange-500 transition-colors">
                                            {select.label}
                                        </label>
                                        <div className="relative border-b border-slate-300 group-focus-within:border-orange-500 transition-all">
                                            <select
                                                {...register(select.id as keyof StepOneForm, { required: true })}
                                                className="w-full bg-transparent py-3 text-lg font-light text-slate-500 outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="">Seleccionar nivel</option>
                                                <option value="vacio">Vacío</option>
                                                <option value="1/4">1/4</option>
                                                <option value="1/2">1/2</option>
                                                <option value="3/4">3/4</option>
                                                <option value="lleno">Lleno</option>
                                            </select>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                                <ChevronRight size={16} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>

                {/* FOOTER - El botón se habilita solo si isValid es true */}
                <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-50 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="group flex items-center gap-4 disabled:opacity-30 disabled:grayscale bg-slate-900 text-white px-12 py-4 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg w-full md:w-auto justify-center"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Siguiente sección</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </footer>
            </form>
        </div>
    );
};

export default StepOneCheck;