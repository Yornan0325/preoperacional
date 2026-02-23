import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, LayoutGrid, ListFilter } from 'lucide-react';
import { useFormatoGetDataStore } from '../../Store/FormatoStore/formatoGetDataStore';
import { FormatoCard } from './FormatosCard';
 

export const FormatosDashboard = () => {
  const navigate = useNavigate();
  const { formatoData, loading } = useFormatoGetDataStore();
  const [searchTerm, setSearchTerm] = useState("");

  const formatosFiltrados = formatoData.filter(f => 
    f.nombreFormato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.numeralSIG.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {/* HEADER DEL DASHBOARD */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Gestión de Plantillas</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            {formatoData.length} Formatos configurados en el sistema
          </p>
        </div>

        <button
          onClick={() => navigate('/editor/nuevo')}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus size={16} /> Crear Nueva Plantilla
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="max-w-7xl mx-auto mb-8 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="BUSCAR POR NOMBRE O CÓDIGO SIG..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
           <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
              <ListFilter size={20} />
           </button>
           <button className="p-2 text-blue-600 bg-blue-50 rounded-lg transition-colors">
              <LayoutGrid size={20} />
           </button>
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargando base de datos...</span>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formatosFiltrados.map((formato) => (
            <FormatoCard
              key={formato.id}
              formato={formato}
              onEdit={(id) => navigate(`/editor/${id}`)}
            />
          ))}
          
          {/* BOTÓN "AÑADIR" TIPO CARD */}
          <button
            onClick={() => navigate('/editor/nuevo')}
            className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all min-h-[250px]"
          >
            <Plus size={40} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase mt-4 tracking-widest">Nueva Plantilla</span>
          </button>
        </div>
      )}
    </div>
  );
};