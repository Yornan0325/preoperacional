import { useForm } from "react-hook-form";
import { useEquipoGetDataStore } from "../../Store/EquipoStore/equipoGetDataStore";
import { useFormatoGetDataStore } from "../../Store/FormatoStore/formatoGetDataStore";
import useModalStore from "../../Store/modalStore";
import IconLucide from "../../Icon/IconLucide";
import { Modal } from "../../ui/Modal";
import { ESTADOS_EQUIPO_OPTIONS } from "../../Utils/opciones";
import { useEffect, useState } from "react";
import type { Equipo, EstadoEquipo } from "../../typesScript/equipoFormType";
import toast from "react-hot-toast";
import { guardarDatosVisualizacion } from "../../Firebase/Service/servicesSet";

const EditarEquipoModal = ({ equipo, estados = ESTADOS_EQUIPO_OPTIONS as any }: { equipo: Equipo, estados?: any[] }) => {
  const { actualizarEquipo } = useEquipoGetDataStore();
  const { isOpen, activeModal, closeModal } = useModalStore();
  const { formatoData, cargarFormatos } = useFormatoGetDataStore();

  const [otros, setOtros] = useState<Record<string, any>>(equipo.otros || {});
  const { register, handleSubmit, reset, watch } = useForm<Partial<Equipo>>({ defaultValues: equipo });

  useEffect(() => {
    if (isOpen && activeModal === `editarEquipo-${equipo.id}`) {
      reset(equipo);
      setOtros(equipo.otros || {});
      if (formatoData.length === 0) cargarFormatos();
    }
  }, [isOpen, activeModal, equipo, reset, formatoData.length, cargarFormatos]);

  // Función para determinar el color de la alerta según la fecha
  const getAlertStyle = (fechaStr: string) => {
    if (!fechaStr) return "bg-slate-50 border-slate-100";
    
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaStr);
    const diferenciaDias = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferenciaDias <= 0) return "bg-rose-50 border-rose-200 ring-1 ring-rose-500/20"; // Vencido
    if (diferenciaDias <= 15) return "bg-amber-50 border-amber-200 ring-1 ring-amber-500/20"; // Próximo a vencer
    return "bg-emerald-50 border-emerald-100"; // Al día
  };

  const onSubmit = async (data: Partial<Equipo>) => {
    try {
      actualizarEquipo(equipo.id, { ...data, otros });
      await guardarDatosVisualizacion(equipo.id, {
        vencimientoExtintor: data.vencimientoExtintor,
        vencimientoSOAT: data.vencimientoSOAT,
        vencimientoTecnoMecanica: data.vencimientoTecnoMecanica,
        otros
      });
      toast.success('Equipo actualizado');
      closeModal();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const inputStyles = "w-full border border-slate-200 bg-white rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium";
  const labelStyles = "block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest";

  return (
    <Modal isOpen={isOpen && activeModal === `editarEquipo-${equipo.id}`} onClose={closeModal}>
      <div className="mb-10 flex items-center gap-5 border-b border-slate-100 pb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-200">
          <IconLucide name="userPen" size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Editar Registro</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placa: {equipo.placa}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* IDENTIFICACIÓN BÁSICA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
                <label className={labelStyles}>Nombre del Equipo</label>
                <input className={inputStyles} {...register("nombreEquipo")} />
            </div>
            <div>
                <label className={labelStyles}>Proyecto</label>
                <input className={inputStyles} {...register("proyecto")} />
            </div>
            <div>
                <label className={labelStyles}>Ubicación</label>
                <input className={inputStyles} {...register("ubicacion")} />
            </div>
        </div>

        {/* VENCIMIENTOS EN 3 COLUMNAS CON ALERTAS */}
        <div className="pt-6 border-t border-slate-100">
          <label className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 block">Control de Vencimientos</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "vencimientoExtintor", label: "Extintor" },
              { id: "vencimientoSOAT", label: "SOAT" },
              { id: "vencimientoTecnoMecanica", label: "Tecno-Mec" }
            ].map((doc) => {
              const valorFecha = watch(doc.id as any);
              return (
                <div key={doc.id} className={`p-4 rounded-4xl border transition-all ${getAlertStyle(valorFecha)}`}>
                  <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block">{doc.label}</label>
                  <input 
                    type="date" 
                    className="w-full bg-transparent border-none p-0 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    {...register(doc.id as any)} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* LOGÍSTICA Y FORMATO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
            <div>
                <label className={labelStyles}>Plantilla Checklist</label>
                <select className={inputStyles} {...register("relacionFormato")}>
                    {formatoData.map(f => <option key={f.id} value={f.id}>{f.nombreFormato}</option>)}
                </select>
            </div>
            <div>
                <label className={labelStyles}>Estado Operativo</label>
                <select className={inputStyles} {...register("estado")}>
                    {estados.map(e => <option key={e.value} value={e.value}>{e.icon} {e.label}</option>)}
                </select>
            </div>
        </div>

        {/* BOTONES ACCIÓN */}
        <div className="flex gap-4 pt-8">
          <button type="button" onClick={closeModal} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Cancelar</button>
          <button type="submit" className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarEquipoModal