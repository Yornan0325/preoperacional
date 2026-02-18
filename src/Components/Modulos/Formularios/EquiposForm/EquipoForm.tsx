import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, ArrowLeftIcon, ClipboardCheck, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { estadoEquipo, type EstadoEquipo } from '../../../typesScript/equipoFormType';
import { createEquipo } from '../../../Firebase/Service/servicesSet';
 

// Tipado del formulario basado estrictamente en tu interfaz Equipo
type FichaEquipoForm = {
    operadorCargo: any;
    operadorNombre: any;
    relacionFormato: string;
    nombreEquipo: string; // Nombre comercial
    placa: string;
    marca: string;
    serial: string;
    proyecto: string;
    ubicacion: string;
    estado: EstadoEquipo;
    // Campos planos para el formulario que luego agrupamos
    nombreOperador: string;
    cargoOperador: string;
};

const EquipoForm = () => {
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { isValid } } = useForm<FichaEquipoForm>({
        mode: 'onChange',
        defaultValues: { 
            estado: 'DISPONIBLE' 
        }
    });



 
const onSubmit = async (data: FichaEquipoForm) => {
        const loadingToast = toast.loading("Guardando equipo con ID...");
        try {
            const payload = {
                nombreEquipo: data.nombreEquipo,
                placa: data.placa,
                marca: data.marca,
                serial: data.serial,
                relacionFormato:"455hgftyunk782",
                estado: data.estado,
                proyecto: data.proyecto,
                ubicacion: data.ubicacion,
                asignadoOperador: {
                    nombre: data.nombreOperador,
                    cargo: data.cargoOperador,                },
                imagen: "" 
            };

            const idFinal = await createEquipo(payload);
            console.log("Equipo creado con ID:", idFinal);
            
            toast.success(`Equipo ${data.placa} guardado correctamente`, { id: loadingToast });
            navigate('/formulario');
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar. Revisa los permisos.", { id: loadingToast });
        }
    };
    // const onSubmit = async (data: FichaEquipoForm) => {
    //     try {
    //         // Transformamos los datos del form a la estructura exacta de la interfaz Equipo
    //         const payload = {
    //             placa: data.placa,
    //             marca: data.marca,
    //             modelo: data.modelo,
    //             serial: data.serial,
    //             relacionFormato: data.relacionFormato,
    //             estado: data.estado,
    //             proyecto: data.proyecto,
    //             ubicacion: data.ubicacion,
    //             zona: data.zona || "",
    //             asignadoOperador: {
    //                 nombre: data.nombreOperador,
    //                 cargo: data.cargoOperador
    //             },
    //             imagen: "" 
    //         };

    //         await createEquipo(payload);
    //         toast.success("Equipo registrado en Firebase");
    //         navigate('/formulario');
    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Error al guardar el equipo");
    //     }
    // };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-4 md:p-8 bg-white shadow-2xl rounded-xl border border-slate-200 my-4">
            
            {/* ACCIONES */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-black font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeftIcon size={16} /> Volver
                </button>
                <button type="submit" disabled={!isValid} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-600 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-20">
                    <SaveIcon size={16} /> Guardar Equipo
                </button>
            </div>

            {/* ENCABEZADO TÉCNICO ESTILO DOCUMENTO */}
            <div className="border-[1.5px] border-black w-full flex mb-12 bg-white overflow-hidden rounded-sm">
                <div className="w-1/3 border-r-[1.5px] border-black p-8 flex items-center justify-center bg-slate-50 text-center">
                    <span className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase italic">Logo Empresa</span>
                </div>

                <div className="w-1/3 border-r-[1.5px] border-black flex flex-col justify-center p-0">
                    <label className="text-[9px] font-black text-slate-400 px-4 pt-2 uppercase">Identificación Comercial</label>
                    <input 
                        {...register("nombreEquipo", { required: true })} 
                        className="w-full text-center font-black uppercase text-sm outline-none focus:bg-yellow-50 px-4 pb-4" 
                        placeholder="EJ: EXCAVADORA CAT 01" 
                    />
                </div>

                <div className="w-1/3 flex flex-col p-0 bg-slate-50">
                    <div className="border-b-[1.5px] border-black p-2 flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Estado Operativo</span>
                        <select 
                            {...register("estado", { required: true })} 
                            className="bg-transparent font-black text-[10px] uppercase text-center outline-none cursor-pointer"
                        >
                            {Object.values(estadoEquipo).map(est => (
                                <option key={est} value={est}>{est}</option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="p-2 flex flex-col items-center justify-center flex-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Serial de Chasis / Motor</span>
                        <input 
                            {...register("serial", { required: true })} 
                            className="bg-transparent font-bold text-[10px] text-center outline-none w-full uppercase" 
                            placeholder="DIGITE SERIAL" 
                        />
                    </div> */}
                </div>
            </div>

            {/* CUERPO DE LA FICHA */}
            <div className="space-y-10">
                
                {/* VINCULACIÓN */}
                <section className="border-[1.5px] border-black p-6 rounded-sm relative bg-white">
                    <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2">
                        <ClipboardCheck size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Plantilla Asociada</span>
                    </div>
                    <select 
                        {...register('relacionFormato', { required: true })} 
                        className="w-full p-2 text-xl font-light border-b border-black outline-none bg-transparent uppercase focus:bg-slate-50"
                    >
                        <option value="" disabled>Seleccione el formato que usará este equipo</option>
                        <option value="1">Grúa Telescópica</option>
                        <option value="2">Vehículo Liviano</option>
                    </select>
                </section>

                {/* ESPECIFICACIONES TÉCNICAS */}
                <section className="border-[1.5px] border-black p-6 rounded-sm relative bg-white">
                    <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2">
                        <Truck size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Datos de Fábrica</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase">Placa / ID Interno</label>
                            <input {...register("placa", { required: true })} className="w-full border-b border-slate-100 py-2 font-bold uppercase outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase">Marca</label>
                            <input {...register("marca", { required: true })} className="w-full border-b border-slate-100 py-2 font-bold uppercase outline-none focus:border-black" />
                        </div>
                        <div>
                            <label className="text-[9px] font-black text-slate-400 uppercase">Serial</label>
                            <input {...register("serial", { required: true })} className="w-full border-b border-slate-100 py-2 font-bold uppercase outline-none focus:border-black" />
                        </div>
                    </div>
                </section>

                {/* ASIGNACIÓN Y LOGÍSTICA */}
                <section className="border-[1.5px] border-black p-6 rounded-sm relative bg-white">
                    <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Responsables y Ubicación</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Proyecto</label>
                            <input {...register("proyecto", { required: true })} className="w-full border-b border-slate-100 py-2 text-sm font-bold outline-none uppercase" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Ubicación</label>
                            <input {...register("ubicacion", { required: true })} className="w-full border-b border-slate-100 py-2 text-sm font-bold outline-none uppercase" />
                        </div>
                       
                       
                    </div>
                </section>

                 <section className="border-[1.5px] border-black p-6 rounded-sm relative bg-white">
                    <div className="absolute -top-3 left-4 bg-white px-2 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Responsables y Ubicación</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                        
                        <div className="lg:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Nombre Operador</label>
                            <input {...register("nombreOperador", { required: true })} className="w-full border-b border-slate-100 py-2 text-sm font-bold outline-none uppercase" />
                        </div>
                        <div className="lg:col-span-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase">Cargo</label>
                            <input {...register("cargoOperador", { required: true })} className="w-full border-b border-slate-100 py-2 text-sm font-bold outline-none uppercase" />
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
};

export default EquipoForm;