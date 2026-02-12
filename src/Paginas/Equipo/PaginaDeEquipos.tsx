import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Loader2, RotateCcw, Search } from "lucide-react";
import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
import { useEquipoGetDataStore } from "../../Components/Store/EquipoStore/equipoGetDataStore";
import useModalStore from "../../Components/Store/modalStore";
import { useSelectedEquipoStore } from "../../Components/Store/EquipoStore/selectedEquipoStore";
import type { Equipo } from "../../Components/typesScript/equipoFormType";
import EquiposCard from "../../Components/Modulos/Equipos/EquiposCard";
import EditarEquipoModal from "../../Components/Modulos/Equipos/EditarEquipoModal";
import CalendarioModal from "../../Components/Modulos/Equipos/CalendarioModal";

const PaginaDeEquipos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"todos" | "pendientes" | "zona">("todos");
  const { openModal } = useModalStore();
  const { setEquipo } = useSelectedEquipoStore();
  const equiposData = useEquipoGetDataStore(state => state.equiposData);
  const loading = useEquipoGetDataStore(state => state.loading);
  const cargarDesdeFirebase = useEquipoGetDataStore(state => state.cargarDesdeFirebase);
  const equipoActivo = useSelectedEquipoStore((state) => state.equipoActivo);

  useEffect(() => {
    if (equiposData.length === 0) cargarDesdeFirebase();
  }, []);

  const equiposFiltrados = useMemo(() => {
    return equiposData.filter(equipo => {
      const searchLower = searchTerm.toLowerCase();
      const cumpleBusqueda =
        equipo.nombre?.toLowerCase().includes(searchLower) ||
        equipo.placa?.toLowerCase().includes(searchLower) ||
        equipo.id?.toLowerCase().includes(searchLower);

      if (filtroActivo === "pendientes") {
        return cumpleBusqueda && equipo.estado === 'MANTENIMIENTO';
      }
      if (filtroActivo === "zona") {
        return cumpleBusqueda && equipo.zona; // Ajustar según lógica de zona real
      }
      return cumpleBusqueda;
    });
  }, [searchTerm, filtroActivo, equiposData]);

  const handleModalCalendario = (equipo: Equipo) => {
    setEquipo(equipo);
    openModal(`calendario-${equipo.id}`);
  };

  const handleModalEditarEquipo = (equipo: Equipo) => {
    setEquipo(equipo);
    openModal(`editarEquipo-${equipo.id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium tracking-tight">Cargando equipos...</p>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Equipos y Maquinaria" />
      <div className="antialiased text-slate-900 min-h-screen">
        {/* Header */}
        {/* Header Compacto */}
        <header className="px-4 py-3 flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-50">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={22} className="text-slate-600" />
          </button>
          <button onClick={() => cargarDesdeFirebase()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <RotateCcw size={18} className="text-slate-600" />
          </button>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Barra de Búsqueda Estilizada */}
          <div className="space-y-5 mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, modelo o ID interno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none text-sm shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Filtros tipo "Pills" */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
              {(['todos', 'pendientes', 'zona'] as const).map((filtro) => (
                <button
                  key={filtro}
                  onClick={() => setFiltroActivo(filtro)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filtroActivo === filtro
                      ? "bg-slate-900 text-white shadow-lg"
                      : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                >
                  {filtro}
                </button>
              ))}
            </div>

            <div className="pt-2 border-l-4 border-blue-600 pl-4">
              <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Equipos y Maquinaria</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Estado Vacío */}
          {equiposFiltrados.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No se encontraron equipos con esos criterios.</p>
            </div>
          )}

          {/* Grid de equipos - 1 col móvil, 2 col tablet, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {equiposFiltrados.map((equipo) => (
              <EquiposCard
                key={equipo.id}
                equipo={equipo}
                handleModalCalendario={handleModalCalendario}
                handleModalEditarEquipo={handleModalEditarEquipo}
              />
            ))}
          </div>
          {equipoActivo && <EditarEquipoModal equipo={equipoActivo} />}
          {equipoActivo && <CalendarioModal equipo={equipoActivo} />}
        </div>
      </div>
    </>
  );
};

export default PaginaDeEquipos;