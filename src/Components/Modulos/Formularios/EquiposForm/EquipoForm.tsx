import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, ArrowLeftIcon, ClipboardCheck, Truck, ShieldCheck, Tractor } from 'lucide-react';
import toast from 'react-hot-toast';

// Stores
import { useFormatoGetDataStore } from '../../../Store/FormatoStore/formatoGetDataStore';
import { createEquipo } from '../../../Firebase/Service/servicesSet';
import { estadoEquipo, type EstadoEquipo } from '../../../typesScript/equipoFormType';

type FichaEquipoForm = {
    relacionFormato: string;
    nombreEquipo: string;
    placa: string;
    marca: string;
    serial: string;
    proyecto: string;
    ubicacion: string;
    estado: EstadoEquipo;
    nombreOperador: string;
    cargoOperador: string;
};

const EquipoForm = () => {
    const navigate = useNavigate();
    const { formatoData, cargarFormatos, loading: loadingFormatos } = useFormatoGetDataStore();

    const { register, handleSubmit, formState: { isValid, isSubmitting } } = useForm<FichaEquipoForm>({
        mode: 'onChange',
        defaultValues: { estado: 'DISPONIBLE' }
    });

    useEffect(() => {
        if (formatoData.length === 0) cargarFormatos();
    }, [formatoData.length, cargarFormatos]);

    const onSubmit = async (data: FichaEquipoForm) => {
        const loadingToast = toast.loading("Sincronizando con la base de datos...");
        try {
            const payload = {
                ...data,
                nombreEquipo: data.nombreEquipo.toUpperCase(),
                placa: data.placa.toUpperCase(),
                marca: data.marca.toUpperCase(),
                serial: data.serial.toUpperCase(),
                proyecto: data.proyecto.toUpperCase(),
                ubicacion: data.ubicacion.toUpperCase(),
                asignadoOperador: {
                    nombre: data.nombreOperador.toUpperCase(),
                    cargo: data.cargoOperador.toUpperCase(),
                },
                imagen: "",
                fechaRegistro: new Date().toISOString()
            };

            await createEquipo(payload);
            toast.success(`Equipo ${data.placa} vinculado con éxito`, { id: loadingToast });
            navigate('/formulario');
        } catch (error) {
            toast.error("Error al guardar en Firebase", { id: loadingToast });
        }
    };

    // Componente auxiliar para inputs consistentes
    const Field = ({ label, children }: { label: string, children: React.ReactNode }) => (
        <div className="flex flex-col group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 group-focus-within:text-blue-600 transition-colors">
                {label}
            </label>
            {children}
        </div>
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-full mx-auto my-2   rounded-2xl overflow-hidden border border-slate-200">

            {/* BARRA DE ACCIONES SUPERIOR */}
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-[10px] uppercase tracking-widest"
                >
                    <ArrowLeftIcon size={14} /> Volver
                </button>
                <div className="flex items-center gap-4">
                    <span className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registro Técnico v1.0</span>
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all text-[10px] font-black uppercase tracking-widest  "
                    >
                        {isSubmitting ? <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" /> : <SaveIcon size={14} />}
                        Guardar Equipo
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-10 space-y-8">
                {/* HEADER TIPO FICHA */}
                <div className="flex flex-col md:flex-row border-2 border-slate-900 rounded-xl bg-white overflow-hidden shadow-sm">
                    <div className="md:w-1/4 bg-slate-900 p-6 flex flex-col items-center justify-center text-center">
                        <Tractor className="text-yellow-400 mb-2" size={32} />
                        <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Equipo</span>
                    </div>

                    <div className="flex-1 p-6 border-y-2 md:border-y-0 md:border-x-2 border-slate-900">
                        <Field label="Nombre del Equipo">
                            <input
                                {...register("nombreEquipo", { required: true })}
                                className="w-full font-black uppercase text-lg md:text-xl outline-none placeholder:text-slate-200"
                                placeholder="EJ: VEHICULO LIVIANO"
                            />
                        </Field>
                    </div>

                    <div className="md:w-1/4 p-6 bg-slate-50 flex flex-col justify-center">
                        <Field label="Estado Actual">
                            <select
                                {...register("estado", { required: true })}
                                className="bg-transparent font-black text-sm uppercase text-blue-600 outline-none cursor-pointer appearance-none"
                            >
                                {Object.values(estadoEquipo).map(est => (
                                    <option key={est} value={est}>{est}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SECCIÓN: INSPECCIÓN */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <ClipboardCheck size={18} />
                            <h3 className="text-[11px] font-black uppercase tracking-wider">Vinculación de Formatos</h3>
                        </div>
                        <Field label="Plantilla Preoperacional">
                            <select
                                {...register('relacionFormato', { required: true })}
                                className="w-full py-2 text-sm font-bold border-b-2 border-slate-100 focus:border-blue-600 outline-none bg-transparent transition-all"
                            >
                                <option value="" disabled>Seleccione una plantilla...</option>
                                {formatoData.map((formato) => (
                                    <option key={formato.id} value={formato.id}>{formato.nombreFormato}</option>
                                ))}
                            </select>
                        </Field>
                        {formatoData.length === 0 && !loadingFormatos && (
                            <p className="text-[10px] text-red-500 mt-2 font-bold italic">⚠️ No hay formatos disponibles.</p>
                        )}
                    </section>

                    {/* SECCIÓN: ESPECIFICACIONES */}
                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <Truck size={18} />
                            <h3 className="text-[11px] font-black uppercase tracking-wider">Especificaciones</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Placa / ID">
                                <input {...register("placa", { required: true })} className="border-b-2 border-slate-100 focus:border-slate-900 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                            <Field label="Marca">
                                <input {...register("marca", { required: true })} className="border-b-2 border-slate-100 focus:border-slate-900 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                            <div className="col-span-2 mt-2">
                                <Field label="Serial de Motor / Chasis">
                                    <input {...register("serial", { required: true })} className="border-b-2 border-slate-100 focus:border-slate-900 py-1 font-bold uppercase outline-none transition-all" />
                                </Field>
                            </div>
                        </div>
                    </section>

                    {/* SECCIÓN: LOGÍSTICA (OCUPA 2 COLUMNAS) */}
                    <section className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <ShieldCheck size={18} />
                            <h3 className="text-[11px] font-black uppercase tracking-wider">Asignación Logística</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Field label="Proyecto">
                                <input {...register("proyecto", { required: true })} className="border-b border-slate-200 focus:border-emerald-500 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                            <Field label="Ubicación">
                                <input {...register("ubicacion", { required: true })} className="border-b border-slate-200 focus:border-emerald-500 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                            <Field label="Operador Responsable">
                                <input {...register("nombreOperador", { required: true })} className="border-b border-slate-200 focus:border-emerald-500 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                            <Field label="Cargo">
                                <input {...register("cargoOperador", { required: true })} className="border-b border-slate-200 focus:border-emerald-500 py-1 font-bold uppercase outline-none transition-all" />
                            </Field>
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
};

export default EquipoForm;