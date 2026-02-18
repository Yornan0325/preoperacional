import React, { useState, useMemo, useCallback } from "react";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import { Modal } from "../../ui/Modal";
import Calendario from "./Calendario";
import IconLucide from "../../Icon/IconLucide";
import useModalStore from "../../Store/modalStore";
import type { Equipo } from "../../typesScript/equipoFormType";

// ✅ 1. TIPOS Y CONSTANTES
const UserRole = {
    OPERADOR: "OPERADOR",
    SISO: "SISO",
    ADMIN: "ADMIN",
    SUPERVISOR: "SUPERVISOR"
} as const;

type UserRole = typeof UserRole[keyof typeof UserRole];

interface ModalCalendarioProps {
    equipo: Equipo;
}

const CalendarioModal: React.FC<ModalCalendarioProps> = ({ equipo }) => {
    const { isOpen, activeModal, closeModal } = useModalStore();
    const { registros, fecha } = usePreoperacionalStore();

    // ✅ 2. ESTADO DE ROL (Simulado)
    const [userRole, setUserRole] = useState<UserRole>(UserRole.OPERADOR);

    // ✅ 3. MEMOIZACIÓN DE DATOS (Rendimiento)
    const fechaISO = useMemo(() => 
        fecha ? fecha.toLocaleDateString("es-CO") : null
    , [fecha]);

    const hoy = useMemo(() => new Date().toLocaleDateString("es-CO"), []);

    const registroExistente = useMemo(() => {
        if (!fechaISO) return null;
        return registros.find((r) => r.equipoId === equipo.id && r.fecha === fechaISO);
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
    const canApprove = (["SISO", "ADMIN", "SUPERVISOR"] as UserRole[]).includes(userRole);

    const modalTitle = useMemo(() => {
        const titles: Record<UserRole, string> = {
            OPERADOR: "Calendario de Inspección",
            SISO: "Gestión Preoperacional",
            SUPERVISOR: "Supervisión de Equipos",
            ADMIN: "Panel de Administración"
        };
        return titles[userRole];
    }, [userRole]);

    // Evitar renderizado si el modal no es el activo
    if (!isOpen || activeModal !== `calendario-${equipo.id}`) return null;

    return (
        <Modal
            isOpen={true} // Ya controlado por el if de arriba
            onClose={closeModal}
            maxWidth={isOperador ? "sm" : "2xl"}
        >
            {/* SIMULADOR DE ROLES (Ocultar en Prod) */}
            {/* <div className="mb-6 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 text-center">Simulador de Rol</p>
                <div className="flex justify-center gap-2">
                    {Object.values(UserRole).map((role) => (
                        <button
                            key={role}
                            onClick={() => setUserRole(role)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                                userRole === role ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div> */}

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
                            • {fechaISO || hoy}
                        </p>
                    </div>
                </div>

                {/* BOTÓN DE ACCIÓN (Añadir/Editar) */}
                {/* {isOperador && (
                    <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all">
                        <IconLucide name={registroExistente ? "pencil" : "plus"} size={20} strokeWidth={1} />
                    </button>
                )} */}
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className={`grid ${isOperador ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-8`}>
                
                {/* Lógica de Dashboard (SISO/ADMIN) */}
                {!isOperador && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Estado de hoy</label>
                            {registroExistente ? (
                                <div className={`rounded-2xl border p-5 ${getStatusStyles(registroExistente.estado)}`}>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-1">
                                        {registroExistente.estado}
                                    </h4>
                                    <p className="text-xs font-medium opacity-80 leading-snug">
                                        {registroExistente.observacion || "Sin novedades reportadas."}
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Pendiente de registro</p>
                                </div>
                            )}
                        </div>

                        {canApprove && (
                             <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${registroExistente?.firmaCis ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                        <IconLucide name="signature" size={18} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-700">Firma CIS</p>
                                        <p className="text-[10px] font-bold uppercase text-slate-400">
                                            {registroExistente?.firmaCis ? "Verificada" : "No firmada"}
                                        </p>
                                    </div>
                                </div>
                                {!registroExistente?.firmaCis && registroExistente && (
                                    <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">Firmar ahora</button>
                                )}
                             </div>
                        )}
                    </div>
                )}

                {/* CALENDARIO (Siempre visible) */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">
                        {isOperador ? "Selecciona Fecha" : "Historial de Inspecciones"}
                    </label>
                    <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-inner">
                        <Calendario />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CalendarioModal;