import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Equipo } from '../../typesScript/equipoFormType';
import toast from 'react-hot-toast';
import { cargarDatosVisualizacion } from '../../Firebase/Service/servicesSet';

interface Props {
  equipo: Equipo;
  isOpen: boolean;
  onClose: () => void;
}

interface DatosVisualizacion {
  vencimientoExtintor?: string;
  vencimientoSOAT?: string;
  vencimientoTecnoMecanica?: string;
  otros?: Record<string, any>;
}

const VisualizarEquipoModal: React.FC<Props> = ({ equipo, isOpen, onClose }) => {
  const [datosVisualizacion, setDatosVisualizacion] = useState<DatosVisualizacion>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const cargarDatos = async () => {
      try {
        setLoading(true);
        const datos = await cargarDatosVisualizacion(equipo.id);
        
        if (datos) {
          setDatosVisualizacion(datos);
        } else {
          setDatosVisualizacion({
            vencimientoExtintor: equipo.vencimientoExtintor || '',
            vencimientoSOAT: equipo.vencimientoSOAT || '',
            vencimientoTecnoMecanica: equipo.vencimientoTecnoMecanica || '',
            otros: equipo.otros || {}
          });
        }
      } catch (error) {
        console.error('Error al cargar datos de visualización', error);
        toast.error('Error al cargar la información');
        setDatosVisualizacion({
          vencimientoExtintor: equipo.vencimientoExtintor || '',
          vencimientoSOAT: equipo.vencimientoSOAT || '',
          vencimientoTecnoMecanica: equipo.vencimientoTecnoMecanica || '',
          otros: equipo.otros || {}
        });
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [isOpen, equipo]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'NO ESPECIFICADO';
    return new Date(dateStr).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* CABECERA */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Ficha Técnica</h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">{equipo.placa}</span>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{equipo.nombreEquipo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 transition-all shadow-sm active:scale-90">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronizando datos...</p>
          </div>
        ) : (
          <div className="p-8 space-y-10">
            
            {/* 1. INFORMACIÓN BÁSICA (COLUMNAS DE 4) */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Datos de Identificación</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
                {[
                  { label: 'Nombre', val: equipo.nombreEquipo },
                  { label: 'Placa', val: equipo.placa },
                  { label: 'Marca', val: equipo.marca || 'N/A' },
                  { label: 'Serial', val: equipo.serial || 'N/A' },
                  { label: 'Proyecto', val: equipo.proyecto || 'N/A' },
                  { label: 'Ubicación', val: equipo.ubicacion || 'N/A' },
                  { label: 'Tipo', val: equipo.tipoEquipo || 'N/A' },
                  { label: 'Modelo', val: equipo.modelo || 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase mb-1">{item.label}</span>
                    <span className="text-sm text-slate-700 font-bold uppercase truncate">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. VENCIMIENTOS (COLUMNAS DE 4) */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Documentos y Vencimientos</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Venc. Extintor', date: datosVisualizacion.vencimientoExtintor },
                  { label: 'Venc. SOAT', date: datosVisualizacion.vencimientoSOAT },
                  { label: 'Venc. Tecno-Mec', date: datosVisualizacion.vencimientoTecnoMecanica },
                ].map((doc, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-colors">
                    <p className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-tighter">{doc.label}</p>
                    <p className="text-xs text-slate-800 font-black">{formatDate(doc.date || '')}</p>
                  </div>
                ))}
                {/* Cuadro de estado rápido */}
                <div className="p-4 bg-blue-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200">
                    <p className="text-[8px] font-black uppercase opacity-80 tracking-widest">Estado Operativo</p>
                    <p className="text-[10px] font-black uppercase italic">Habilitado</p>
                </div>
              </div>
            </div>

            {/* 3. OTROS CAMPOS (COLUMNAS DE 4) */}
            {datosVisualizacion.otros && Object.keys(datosVisualizacion.otros).length > 0 && (
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Atributos Adicionales</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(datosVisualizacion.otros).map(([k, v]) => (
                    <div key={k} className="p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 truncate">{k}</p>
                      <p className="text-[11px] font-bold text-slate-700 uppercase leading-tight">{String(v)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACCIÓN DE CIERRE */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={onClose} 
                className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Cerrar Reporte
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarEquipoModal;