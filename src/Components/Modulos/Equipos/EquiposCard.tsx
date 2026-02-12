import React, { useMemo } from "react";
import { Pencil, UserPlus, MapPin, Tag } from "lucide-react";
import type { Equipo } from "../../typesScript/equipoFormType";
import { EstadoEquipoColor } from "../../Constants/opciones";

interface EquiposCardProps {
  equipo: Equipo;
  handleModalCalendario: (equipo: Equipo) => void;
  handleModalEditarEquipo: (equipo: Equipo) => void;
}

const EquiposCard = React.memo(({ equipo, handleModalCalendario, handleModalEditarEquipo }: EquiposCardProps) => {
  
  // Memorizamos el color para no recalcularlo en renders innecesarios
  const statusClasses = useMemo(() => {
    return EstadoEquipoColor[equipo.estado] || "bg-slate-100 text-slate-500";
  }, [equipo.estado]);

  // Función para obtener iniciales
  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
        onClick={(e) => {
          e.stopPropagation();
          handleModalCalendario(equipo);
        }}
      className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[180px]"
    >
      <div>
        {/* INFO SUPERIOR: Badge y Proyecto */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-1.5 flex-wrap">
            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${statusClasses}`}>
              {equipo.estado}
            </span>
            <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-100 text-slate-500 flex items-center gap-1">
              <Tag size={10} /> {equipo.proyecto}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleModalEditarEquipo(equipo);
            }}
            className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-slate-800 leading-none mb-1 truncate group-hover:text-blue-600 transition-colors">
              {equipo.nombre}
            </h3>
            <div className="flex items-center gap-1 text-slate-400 mb-3">
              <MapPin size={10} />
              <p className="text-[10px] font-bold uppercase truncate">
                {equipo.id} • {equipo.ubicacion}
              </p>
            </div>
          </div>

          {/* IMAGEN CON ASPECT RATIO FIJO */}
          <div className="w-20 h-16 shrink-0 rounded-xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50">
            <img
              src={equipo.imagen || "/placeholder-equipo.png"}
              alt={equipo.nombre}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Operador o Acción */}
      <div className="pt-3 mt-3 border-t border-slate-50">
        {equipo.asignadoOperador ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                {getInitials(equipo.asignadoOperador.nombre)}
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800 leading-none">
                  {equipo.asignadoOperador.nombre}
                </p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                  {equipo.asignadoOperador.cargo}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button 
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              equipo.estado === "MANTENIMIENTO" 
              ? "bg-rose-50 text-rose-500 cursor-not-allowed" 
              : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
            disabled={equipo.estado === "MANTENIMIENTO"}
          >
            {equipo.estado === "MANTENIMIENTO" ? (
              <span>En Mantenimiento</span>
            ) : (
              <>
                <UserPlus size={14} />
                Asignar Operador
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});

export default EquiposCard;