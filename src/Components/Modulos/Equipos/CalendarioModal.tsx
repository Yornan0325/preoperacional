import React, { useState, useMemo, useCallback, useRef } from "react";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import { Modal } from "../../ui/Modal";
import Calendario from "./Calendario";
import IconLucide from "../../Icon/IconLucide";
import useModalStore from "../../Store/modalStore";
import type { Equipo } from "../../typesScript/equipoFormType";
import SignatureCanvas from 'react-signature-canvas';
import { bulkSignInspecciones } from "../../Firebase/Service/servicesSet";
import toast from "react-hot-toast";
import VisualizadorReporte from "./VisualizadorReporte";

// ✅ 1. TIPOS Y CONSTANTES
const UserRole = {
    OPERADOR: "OPERADOR",
    SISO: "SISO",
    ADMIN: "ADMIN",
    SUPERVISOR: "SUPERVISOR",
    COPAS: "COPAS"
} as const;

type UserRole = typeof UserRole[keyof typeof UserRole];

interface ModalCalendarioProps {
    equipo: Equipo;
}

const CalendarioModal: React.FC<ModalCalendarioProps> = ({ equipo }) => {
    const { isOpen, activeModal, closeModal } = useModalStore();
    const { registros, fecha, fechasSeleccionadas, setFechasSeleccionadas, cargarRegistros } = usePreoperacionalStore();

    // ✅ 2. ESTADO DE ROL (Simulado)
    const [userRole, setUserRole] = useState<UserRole>(UserRole.SISO);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
    const [isReportViewOpen, setIsReportViewOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Limpiar selección al cerrar o cambiar rol
    const cleanSelection = useCallback(() => setFechasSeleccionadas([]), [setFechasSeleccionadas]);

    // ✅ 3. MEMOIZACIÓN DE DATOS (Rendimiento)
    const fechaISO = useMemo(() => {
        if (!fecha) return new Date().toLocaleDateString("en-CA");
        return fecha.toLocaleDateString("en-CA");
    }, [fecha]);

    const fechaDisplay = useMemo(() =>
        fecha ? fecha.toLocaleDateString("es-CO") : new Date().toLocaleDateString("es-CO")
        , [fecha]);

    const registroExistente = useMemo(() => {
        if (!fechaISO || !registros || registros.length === 0) return null;

        return registros.find((r) =>
            r.equipoId?.trim() === equipo.id?.trim() &&
            r.fechaInspeccion === fechaISO
        );
    }, [registros, equipo.id, fechaISO]);

    // ✅ 4. HELPERS DE ESTILO Y PERMISOS
    const getStatusStyles = useCallback((estado?: string) => {
        const status = estado?.toUpperCase();
        if (status === "APROBADO") return "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20";
        if (status === "PENDIENTE") return "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20";
        if (status === "RECHAZADO") return "text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20";
        return "text-slate-500 bg-slate-50 border-slate-100";
    }, []);

    const isOperador = userRole === UserRole.OPERADOR;

    const modalTitle = useMemo(() => {
        const titles: Record<UserRole, string> = {
            OPERADOR: "Calendario de Inspección",
            SISO: "Gestión Preoperacional",
            SUPERVISOR: "Supervisión de Equipos",
            ADMIN: "Panel de Administración",
            COPAS: "Validación COPASST"
        };
        return titles[userRole];
    }, [userRole]);

    // Función para manejar el reporte (Visualizar vs Descargar)
    const handleReportAction = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            console.log("Descargando reporte para:", fechasSeleccionadas);
            toast.success("Iniciando descarga de reportes...");
        } else {
            setIsReportViewOpen(true);
        }
    };

    // Función real para guardar firmas masivas en Firebase
    const handleBulkSign = async (signature64: string) => {
        setIsSaving(true);
        console.log("🚀 Iniciando firma masiva:", {
            equipoId: equipo.id,
            fechas: fechasSeleccionadas,
            rol: userRole
        });

        try {
            await toast.promise(
                bulkSignInspecciones(
                    equipo.id,
                    fechasSeleccionadas,
                    userRole,
                    signature64
                ),
                {
                    loading: 'Guardando firmas en Firebase...',
                    success: `¡Éxito! Se firmaron ${fechasSeleccionadas.length} documentos.`,
                    error: 'Error al intentar guardar las firmas.'
                }
            );

            // Recargar datos para actualizar el calendario
            const hoy = new Date();
            const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
            const anio = hoy.getFullYear().toString();
            await cargarRegistros(equipo.id, mes, anio);

            setIsSignatureModalOpen(false);
            cleanSelection();
        } catch (error) {
            console.error("❌ Error crítico en handleBulkSign:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Evitar renderizado si el modal no es el activo
    if (!isOpen || activeModal !== `calendario-${equipo.id}`) return null;

    return (
        <Modal
            isOpen={true}
            onClose={() => {
                cleanSelection();
                closeModal();
            }}
            maxWidth={isOperador ? "md" : "5xl"}
        >
            {/* SIMULADOR DE ROLES (Ocultar en Prod) */}
            <div className="mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 text-center">Simulador de Rol</p>
                <div className="flex justify-center gap-2">
                    {Object.values(UserRole).map((role) => (
                        <button
                            key={role}
                            onClick={() => {
                                setUserRole(role);
                                cleanSelection();
                            }}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${userRole === role ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* HEADER DINÁMICO */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">
                        {modalTitle}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase tracking-tighter">
                            {equipo.placa}
                        </span>
                        <p className="text-[11px] font-bold text-slate-400 uppercase">
                            • {fechaDisplay}
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="w-full relative">
                {isOperador ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase text-slate-400">Historial de Inspecciones</label>
                        </div>
                        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
                            <Calendario userRole={userRole} />
                        </div>
                        <div className="flex justify-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase">Aprobado</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase">Pendiente</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase">Rechazado</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            {fechasSeleccionadas.length > 0 ? (
                                <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-2xl animate-in zoom-in-95 duration-300">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black">
                                                {fechasSeleccionadas.length}
                                            </div>
                                            <p className="text-xs font-black uppercase italic">Días seleccionados</p>
                                        </div>
                                        <p className="text-[9px] text-slate-400 uppercase font-medium">Gestiona múltiples reportes a la vez</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setIsSignatureModalOpen(true)}
                                            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
                                        >
                                            <IconLucide name="signature" size={16} strokeWidth={2.5} />
                                            Firmar Selección
                                        </button>
                                        <button
                                            onClick={handleReportAction}
                                            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all"
                                        >
                                            <IconLucide name={window.innerWidth < 768 ? "printer" : "fileText"} size={16} strokeWidth={2.5} />
                                            {window.innerWidth < 768 ? "Descargar Reportes" : "Visualizar Reportes"}
                                        </button>
                                        <button
                                            onClick={cleanSelection}
                                            className="text-[9px] font-black uppercase text-slate-400 hover:text-white transition-colors mt-2"
                                        >
                                            Cancelar Selección
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center bg-slate-50/30">
                                    <IconLucide name="plus" size={32} strokeWidth={1.5} className="text-slate-300 mb-4" />
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">
                                        Selecciona uno o más días <br /> en el calendario para gestionar
                                    </p>
                                </div>
                            )}
                            {!fechasSeleccionadas.length && registroExistente && (
                                <div className="space-y-3 animate-in fade-in duration-500">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Detalle del día {fechaDisplay}</label>
                                    <div className={`rounded-2xl border p-4 ${getStatusStyles(registroExistente.estado)}`}>
                                        <h4 className="text-lg font-black italic uppercase mb-1">{registroExistente.estado}</h4>
                                        <p className="text-[10px] font-medium opacity-80">{registroExistente.observacion || "Sin novedades."}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase text-slate-400">Historial de Inspecciones</label>
                                {!isOperador && (
                                    <span className="text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full uppercase">Selección Múltiple Activa</span>
                                )}
                            </div>
                            <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-inner">
                                <Calendario userRole={userRole} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isReportViewOpen && (
                <VisualizadorReporte
                    onClose={() => setIsReportViewOpen(false)}
                    equipo={equipo}
                    registros={registros.filter(r => fechasSeleccionadas.includes(r.fechaInspeccion))}
                />
            )}

            {isSignatureModalOpen && (
                <SignatureModal
                    onClose={() => setIsSignatureModalOpen(false)}
                    onSave={handleBulkSign}
                    isSaving={isSaving}
                    title="Validación de Seguridad"
                    subtitle={`Firmando reporte de ${fechasSeleccionadas.length} días`}
                />
            )}
        </Modal>
    );
};

// --- COMPONENTE INTERNO: MODAL DE FIRMA ---
interface SignatureModalProps {
    onClose: () => void;
    onSave: (signature: string) => void;
    isSaving: boolean;
    title: string;
    subtitle: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ onClose, onSave, isSaving, title, subtitle }) => {
    const sigCanvas = useRef<any>(null);

    const clear = () => sigCanvas.current.clear();
    const save = () => {
        if (sigCanvas.current.isEmpty()) return;
        const data = sigCanvas.current.getCanvas().toDataURL('image/png');
        onSave(data);
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-slate-800">{title}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <IconLucide name="x" size={20} strokeWidth={2} />
                    </button>
                </div>

                <div className="p-8">
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 h-64 overflow-hidden relative cursor-crosshair">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="#0f172a"
                            canvasProps={{ className: "w-full h-full" }}
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                            <span className="text-[8px] font-black uppercase text-slate-300 tracking-[0.3em] bg-white px-4 py-1 rounded-full shadow-sm">Área de Firma Digital</span>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-2 grid grid-cols-2 gap-4">
                    <button
                        onClick={clear}
                        className="py-4 text-[10px] font-black uppercase border-2 border-slate-100 text-slate-400 rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        Limpiar
                    </button>
                    <button
                        onClick={save}
                        disabled={isSaving}
                        className="py-4 text-[10px] font-black uppercase bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Guardando..." : "Confirmar Firma"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalendarioModal;