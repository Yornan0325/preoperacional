import { ChevronRight, Info, X, ClipboardCheck, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useEquipoFormStore from '../../../Store/EquipoStore/equipoFormStore';
import { useStepsStore } from '../../../Store/useStepsStore';
import toast from 'react-hot-toast';

type StepOneForm = {
    createdFormat: string;
    relacionFormato: string;
    relacionEquipo: string;
    placa: string;
    marca: string;
    modelo: string;
    serial: string;
    proyecto: string;
    ubicacion: string;
    asignadoOperador: string;
    estado: string;


};
type FieldConfig = {
    id: keyof StepOneForm;
    label: string;
    placeholder?: string;
    type: 'text' | 'file' | 'select';
    span?: string;
    options?: string[];
    value?: string;
};
interface FormatoOption {
    value: string;
    label: string;
}
const fields: FieldConfig[] = [

    {
        id: 'relacionEquipo',
        label: 'Equipo',
        placeholder: 'Ej. Vehículo liviano',
        // value: 'VEHÍCULO LIVIANO',
        type: 'text',
    },

    {
        id: 'placa',
        label: 'Placa',
        placeholder: 'Ej. ABC-123',
        // value: 'ABC-123',
        type: 'text',
    },
    {
        id: 'marca',
        label: 'Marca',
        placeholder: 'Ej. Nissan',
        // value: 'NISSAN',
        type: 'text',
    },
    {
        id: 'modelo',
        label: 'Modelo',
        placeholder: 'Ej. 2020',
        // value: '2020',
        type: 'text',
    },

    {
        id: 'serial',
        label: 'Serial',
        placeholder: 'Ej. 8ANNBD33F5PL478001',
        // value: '8ANNBD33F5PL478001',
        type: 'text',
    },
    {
        id: 'proyecto',
        label: 'Proyecto',
        placeholder: 'Ej. Proyecto 1',
        // value: 'PROYECTO 1',
        type: 'text',
    },
    {
        id: 'ubicacion',
        label: 'Ubicación',
        placeholder: 'Ej. Obra 1',
        // value: 'OBRA 1',
        type: 'text',
    },
    {
        id: 'estado',
        label: 'Estado del equipo',
        // value: 'OPERATIVA',
        type: 'select',
        options: ['OPERATIVA', 'PENDIENTE', 'MANTENIMIENTO'],
    },
    {
        id: 'asignadoOperador',
        label: 'Asignado Operador',
        placeholder: 'Ej. Juan Perez',
        // value: 'JUAN PEREZ',
        type: 'text',
    },


];
const formatosData: FormatoOption[] = [
    { value: 'VEHICULO_LIVIANO', label: 'Vehículo liviano' },
    { value: 'EXCAVADORA_DE_ORUGAS', label: 'Excavadora de orugas' },
    { value: 'VOLQUETA', label: 'Volqueta' },
    { value: 'MOTOCICLETA', label: 'Motocicleta' },
    { value: 'MOTONIVELADORA', label: 'Motoniveladora' },

] as const;
const StepOneEquipoForm = () => {
    // const { saveEquipo } = useEquipoFormStore();
    const { step, maxSteps, nextStep, prevStep, canGoPrev } = useStepsStore();




    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<StepOneForm>({
        mode: 'onChange',
        defaultValues: {
            relacionFormato: '',
            relacionEquipo: '',
            placa: '',
            marca: '',
            modelo: '',
            serial: '',
            proyecto: '',
            ubicacion: '',
            asignadoOperador: '',
            estado: '',
        },
    });

    const onSubmit = async (data: StepOneForm) => {

        if (data.relacionFormato.length === 0) {
            toast.error('Debes crear al menos una sección');
            return;
        }
        
        if (step < maxSteps) {
            nextStep();
        } else {
            const payload: StepOneForm = {
                ...data,
            };

            console.log(JSON.stringify(payload, null, 2));
            alert("Inspección enviada. Revisa la consola.");
        }
        // saveEquipo(data);

    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="min-h-screen bg-white flex flex-col font-sans text-slate-900 w-full"
        >
            {/* HEADER MINIMALISTA */}
            <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
                <button
                    type="button"
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                    onClick={() => {
                        // Si hay un paso anterior, retrocede, de lo contrario cierra o algo
                        if (canGoPrev()) {
                            prevStep();
                        } else {
                            // Lógica para cerrar o cancelar
                        }
                    }}
                >
                    {canGoPrev() ? <ChevronLeft size={24} /> : <X size={24} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">Inicio</span>
                    <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-0.5">
                        Paso {step} / {maxSteps}
                    </h1>                </div>
                <button type="button" className="text-rose-500/40 hover:text-rose-500 transition-colors">
                    <Info size={20} />
                </button>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
                    <div
                        className="h-full bg-rose-600 transition-all duration-500"
                        style={{ width: `${(step / maxSteps) * 100}%` }}
                    ></div>
                </div>
            </header>

            <main className="flex-1 w-full">
                {/* HERO SECTION - Branding */}
                <section className="px-6 py-12 md:px-12 bg-slate-50/50">
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
                        Crear Equipo

                    </h2>
                    <p className="text-sm text-slate-500 mt-4">
                        Define la información general del equipo
                    </p>
                </section>

                <div className="px-6 md:px-12 py-10 space-y-16">

                    {/* SECCIÓN: FORMATO */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">01</span>
                            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">Equipo</h3>
                            <div className="h-[1px] flex-1 bg-slate-100"></div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                                Relación formato
                            </label>

                            <div className="flex w-1/3 items-center gap-3 border-b border-slate-200">
                                <ClipboardCheck size={20} className="text-slate-300" />

                                <select
                                    {...register('relacionFormato', { required: true })}
                                    defaultValue=""
                                    className="w-full bg-transparent text-xl font-light text-slate-800 outline-none appearance-none"
                                >
                                    <option value="" disabled hidden>
                                        Selecciona un formato
                                    </option>

                                    {formatosData.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {errors.relacionFormato && (
                                <span className="text-[10px] text-rose-500 font-bold italic">
                                    Campo obligatorio
                                </span>
                            )}
                        </div>
                    </section>

                    {/* SECCIÓN: EQUIPO */}
                    <section className="space-y-10">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">
                                02
                            </span>
                            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Especificaciones
                            </h3>
                            <div className="h-[1px] flex-1 bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {fields.map((field) => (
                                <div key={field.id} className="group flex flex-col">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                                        {field.label}
                                    </label>

                                    {/* TEXT */}
                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            {...register(field.id, { required: true })}
                                            placeholder={field.placeholder}
                                            className="text-xl font-light text-slate-800 bg-transparent border-b border-slate-200"
                                        />
                                    )}

                                    {/* SELECT */}
                                    {field.type === 'select' && (
                                        <select
                                            {...register(field.id, { required: true })}
                                            defaultValue=""
                                            className="text-xl font-light text-slate-800 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none pb-2 appearance-none"
                                        >
                                            <option value="" disabled hidden>
                                                Selecciona una opción
                                            </option>

                                            {field.options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {/* FILE */}
                                    {field.type === 'file' && (
                                        <input
                                            type="file"
                                            {...register(field.id)}
                                            className="text-sm text-slate-600 file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-xs file:font-bold
                                                file:bg-slate-100 file:text-slate-700
                                                hover:file:bg-slate-200"
                                        />
                                    )}

                                    {errors[field.id] && (
                                        <span className="text-[10px] text-rose-500 font-bold italic mt-1">
                                            Campo obligatorio
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN: OPERACIÓN */}

                </div>
            </main>

            {/* FOOTER FIJO */}
            <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-50 flex justify-end">
                <button
                    type="submit"
                    className="group flex items-center disabled:opacity-20 disabled:cursor-not-allowed gap-4 bg-emerald-600 text-white px-10 py-4 rounded-full hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
                    disabled={!isValid}
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {step === maxSteps ? 'Enviar datos' : 'Siguiente'}
                    </span>
                    {step < maxSteps && (
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    )}
                </button>

            </footer>
        </form>
    );
};

export default StepOneEquipoForm;


