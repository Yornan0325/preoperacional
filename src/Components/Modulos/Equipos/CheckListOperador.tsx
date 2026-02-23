import { useEffect, useMemo, useRef, useState } from "react";
import PageBreadcrumb from "../../Comun/PageBreadCrumb";
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from "react-router-dom";
import { useSelectedEquipoStore } from "../../Store/EquipoStore/selectedEquipoStore";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import { useFormatoGetDataStore } from "../../Store/FormatoStore/formatoGetDataStore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
// import { useFormatoFormStore } from "../../Store/FormatoStore/useFormatoFormStore";
import { ArrowLeftIcon, Camera, Check, PenTool, X } from "lucide-react";
import Loader from "../../Utils/MensajesEIndicadores/Spinner";
import useModalStore from "../../Store/modalStore";

const CheckListOperador = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { formatoData, cargarFormatos, loading } = useFormatoGetDataStore();
    const { equipoActivo } = useSelectedEquipoStore();
    const { fecha, registros } = usePreoperacionalStore();
    // const { generalData } = useFormatoFormStore();
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const sigCanvas = useRef<any>(null);
    const { openModal } = useModalStore();


    const navigate = useNavigate();

    const fechaIso = useMemo(() =>
        fecha ? fecha.toLocaleDateString("es-CO") : null
        , [fecha]);

    const formato = formatoData.find(f => f.id === equipoActivo?.relacionFormato);
    const datosExistentes = registros.find(r =>
        r.equipoId === equipoActivo?.id && r.fecha === fechaISO
    );
    useEffect(() => {
        if (formatoData.length === 0) {
            cargarFormatos();
        }
    }, [formatoData.length, cargarFormatos]);

    useEffect(() => {
        if (!datosExistentes && formato) {
            formato.checklist.forEach(campo => {
                setValue(`respuestas.${campo.id}`, "B");
            });
        }
    }, [formato]);

    const defaultChecklistValues = useMemo(() => {
        const acc: any = {};
        formato?.checklist.forEach((seccion: any) => {
            seccion.items?.forEach((campo: any) => {
                // Si es booleano o similar, por defecto "B" (Bueno)
                if (campo.tipo === 'boolean' || campo.tipo === 'checkbox') {
                    acc[campo.id] = "B";
                } else {
                    acc[campo.id] = "";
                }
            });
        });
        return acc;
    }, [formato]);

    const { register, handleSubmit, watch, setValue, formState: { isValid } } = useForm({
        mode: 'onChange',
        defaultValues: {
            respuestas: datosExistentes?.respuestas || defaultChecklistValues,
            observaciones: datosExistentes?.observaciones || {}
        }
    });

    // const watchRespuestas = watch("respuestas");
    // const valorActual = watch(`respuestas.${campo.id}`);


    // Funciones de firma
    const clearSignature = () => sigCanvas.current.clear();
    const saveSignature = () => {
        if (sigCanvas.current.isEmpty()) {
            toast.error("Por favor, estampe su firma antes de continuar");
            return;
        }
        const canvas = sigCanvas.current.getCanvas();
        const base64 = canvas.toDataURL('image/png');
        setSignatureData(base64);
        setIsModalOpen(false);
        toast.success("Firma capturada correctamente");
    };

    const onSubmit = (formData: any) => {
        if (!signatureData) {
            toast.error("La firma del operador es obligatoria");
            return;
        }


        // Payload final estructurado para el registro de inspección
        // Transformar respuestas incluyendo nombre del item
        const respuestasTransformadas = formato?.checklist.flatMap((seccion: any) =>
            seccion.items?.map((campo: any) => ({
                id: campo.id,
                nombre: campo.nombre,
                seccion: seccion.nombre,
                valor: formData.respuestas?.[campo.id] ?? "B",
                observacion: formData.observaciones?.[campo.id] || null
            }))
        );
        const payload = {
            equipoId: equipoActivo?.id,
            placa: equipoActivo?.placa,
            formatoId: formato?.id,
            nombreFormato: formato?.nombreFormato,
            fechaInspeccion: fecha?.toISOString().split('T')[0],
            creadoEn: new Date().toISOString().split('T')[0],
            respuestas: respuestasTransformadas,
            firmaOperador: signatureData,
            estado: "PENDIENTE"
        };
        // const payload = {
        //     equipoId: equipoActivo?.id,
        //     placa: equipoActivo?.placa,
        //     formatoId: formato?.id,
        //     nombreFormato: formato?.nombreFormato,
        //     fechaInspeccion: fecha?.toISOString().split('T')[0],
        //     creadoEn: new Date().toISOString().split('T')[0],
        //     respuestas: formData.respuestas,
        //     observacionesEspecíficas: formData.observaciones,
        //     firmaOperador: signatureData,
        //     estado: "PENDIENTE" // Para flujo de aprobación posterior
        // };

        console.log("Payload para Firebase:", payload);
        toast.success('Inspección guardada localmente (Falta conectar Service)');
        // Aquí llamarías a: await saveInspeccion(payload);
    };




    const fechaISO = fecha?.toLocaleDateString("en-CA");


    const handleVolver = () => {
        navigate(`/equipo`);
    };

    if (!equipoActivo || loading) {
        return (
            <Loader />
        );
    }


    if (!formato) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 font-bold uppercase text-xs">Error de Vinculación</p>
                <h2 className="text-sm font-black mt-2">El equipo {equipoActivo?.placa} tiene asignado el formato:</h2>
                <code className="bg-slate-100 p-2 rounded mt-2 inline-block text-blue-600">"{equipoActivo?.relacionFormato}"</code>
                <p className="mt-4 text-slate-500 text-[10px]">Verifica que este ID exista exactamente igual en Firebase.</p>
                <button onClick={handleVolver} className="mt-6 btn bg-black text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Volver</button>
            </div>
        );
    }
    if (!formato) return <div>El equipo no tiene un formato asignado.</div>;

    return (
        <>
            <PageBreadcrumb pageTitle="Preoperacional" />
            <div className="min-h-screen flex flex-col font-sans text-slate-900 w-full relative">
                <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => {
                            openModal(`calendario-${equipoActivo?.id}`);
                            navigate(-1);
                        }}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeftIcon size={14} /> volver a calendario
                    </button>

                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col pb-24">
                    <main className="flex-1">
                        {/* INFO DEL EQUIPO - MÁS COMPACTA */}
                        <section className="px-5 py-5 bg-slate-900 border   rounded-lg  text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">Inspección..</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Checklist Equipo</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] font-black bg-white/10 border border-white/20 px-3 py-1 rounded-lg inline-block">{equipoActivo?.nombreEquipo} | {equipoActivo?.placa}</span>
                                <p className="text-[16px] font-medium text-slate-500 mt-1 uppercase italic">{fechaIso}</p>
                            </div>
                        </section>

                        <div className="p-4 space-y-8">
                            {formato.checklist.map((seccion: any, idx: number) => (
                                <section key={seccion.id} className="space-y-3">
                                    {/* SECCIÓN LABEL */}
                                    <div className="flex items-center gap-2 mb-4 px-1">
                                        <div className="h-5 w-1 bg-blue-600 rounded-full"></div>

                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{idx + 1}-{seccion.nombre}</h3>
                                    </div>

                                    <div className="space-y-2">
                                        {seccion.items?.map((campo: any) => {
                                            const valorActual = watch(`respuestas.${campo.id}`) ?? "B";

                                            const esMalo = valorActual === 'M';

                                            return (
                                                <div
                                                    key={campo.id}
                                                    className={`transition-all  p-3 flex flex-col gap-3
                                                   
                                                    ${esMalo ? 'border-rose-200 bg-rose-50/30 ring-1 ring-rose-200' : ''}
                                                    `}
                                                >
                                                    {/* FILA PRINCIPAL: TEXTO IZQUIERDA | OPCIONES DERECHA */}
                                                    <div className="flex items-center gap-3 w-full">
                                                        <div className="flex items-center  flex-1 gap-3 min-w-0">
                                                            <span className={`text-[12px]  inline-block  align-middle   font-semibold uppercase leading-snug block transition-colors
                                                                ${valorActual ? 'text-slate-900' : 'text-slate-500'}`}>
                                                                {campo.nombre}
                                                            </span>
                                                            <div className="flex-1 h-px bg-slate-200"></div>
                                                            {campo.ayuda && <p className="text-[9px] text-slate-400 italic mt-0.5">{campo.ayuda}</p>}
                                                            {/* <hr className="h-px my-8 bg-neutral-quaternary border-1"/> */}
                                                        </div>
                                                        {/* SELECTOR DE OPCIONES FRENTE AL TEXTO */}
                                                        <div className="flex items-center shrink-0">

                                                            {(campo.tipo === 'boolean' || campo.tipo === 'checkbox') ? (
                                                                <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                                                                    {['B', 'M', 'NA'].map((opt) => (
                                                                        <button
                                                                            key={opt}
                                                                            type="button"
                                                                            onClick={() => setValue(`respuestas.${campo.id}`, opt, { shouldValidate: true })}
                                                                            className={`w-10 h-9 rounded-lg text-[10px] font-black transition-all flex items-center justify-center
                                                                            ${valorActual === opt
                                                                                    ? (opt === 'M' ? 'bg-rose-600 text-white shadow-md scale-105' : 'bg-slate-900 text-white shadow-md scale-105')
                                                                                    : 'text-slate-400 hover:text-slate-600'}
                                                                                     `}
                                                                        >
                                                                            {opt}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type={campo.tipo === 'number' ? 'number' : 'text'}
                                                                    {...register(`respuestas.${campo.id}`)}
                                                                    className="w-32 bg-white border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-black text-center outline-none focus:ring-2 ring-slate-900"
                                                                    placeholder="0"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Hallazgo/Foto solo si es Malo */}
                                                    {esMalo && (
                                                        <div className="flex gap-2 items-center animate-in zoom-in-95 duration-200">
                                                            <div className="flex-1">
                                                                <input
                                                                    {...register(`observaciones.${campo.id}`)}
                                                                    placeholder="¿Qué falla encontró?"
                                                                    className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 ring-rose-400"
                                                                />
                                                            </div>
                                                            <button type="button" className="shrink-0 h-10 w-10 bg-rose-500 text-white rounded-xl shadow-lg flex items-center justify-center active:scale-90 transition-transform">
                                                                <Camera size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}

                            {/* FIRMA COMPACTA */}
                            <div
                                onClick={() => setIsModalOpen(true)}
                                className={`w-full py-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all
                                ${signatureData ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'}`}
                            >
                                {signatureData ? (
                                    <img src={signatureData} alt="Firma" className="h-16 object-contain mix-blend-multiply" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <PenTool size={20} className="text-slate-300 mb-1" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma requerida</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>

                    {/* BOTÓN FLOTANTE FINALIZAR */}
                    <footer className="fixed bottom-0 left-0 md:left-80 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50">
                        <button
                            type="submit"
                            disabled={!isValid || !signatureData}
                            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-xl disabled:opacity-20 transition-all active:scale-95"
                        >
                            Finalizar Checklist
                            <Check size={20} strokeWidth={3} />
                        </button>
                    </footer>
                </form>

                {/* MODAL DE FIRMA FULL SCREEN */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in slide-in-from-bottom-5">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-xs font-black uppercase italic">Validación Digital</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="flex-1 bg-slate-50 cursor-crosshair">
                            <SignatureCanvas
                                ref={sigCanvas}
                                penColor="black"
                                canvasProps={{ className: "w-full h-full" }}
                            />
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t">
                            <button type="button" onClick={clearSignature} className="py-4 text-[10px] font-black uppercase border rounded-2xl text-slate-400">Limpiar</button>
                            <button type="button" onClick={saveSignature} className="py-4 text-[10px] font-black uppercase bg-slate-900 text-white rounded-2xl">Confirmar</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CheckListOperador;