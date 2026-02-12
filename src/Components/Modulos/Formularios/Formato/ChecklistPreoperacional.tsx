import { useEffect, type Key } from "react";
import { useParams } from "react-router-dom";
import { useFormatoGetDataStore } from "../../../Store/FormatoStore/formatoGetDataStore";
import useSelectedFormatoStore from "../../../Store/FormatoStore/selectedFormatoStore";

const ChecklistPreoperacional = ({ formatoSeleccionado }: { formatoSeleccionado: any }) => {
  const { id } = useParams();
  const { loading, cargarDesdeFirebase } = useFormatoGetDataStore();
  const setObservaciones = useSelectedFormatoStore((s) => s.setObservaciones);
  const setChecklistValue = useSelectedFormatoStore((s) => s.setChecklistValue);

  useEffect(() => {
    if (formatoSeleccionado.length === 0) {
      cargarDesdeFirebase();
    }
  }, [formatoSeleccionado.length, cargarDesdeFirebase]);

  if (loading) return <div className="p-10 text-center">Cargando formato...</div>;
  if (!formatoSeleccionado) return <p className="p-10 text-center">No se encontró el formato</p>;

  const secciones = formatoSeleccionado.checklist || formatoSeleccionado.modulos || [];

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white text-black font-sans">
      
      {/* --- ENCABEZADO TIPO TABLA (SEGÚN IMAGEN) --- */}
      <div className="border-2 border-black w-full flex overflow-hidden mb-6 text-xs uppercase font-bold">
        {/* Logo */}
        <div className="w-1/3 border-r-2 border-black p-4 flex items-center justify-center">
          <img 
            src="/path-to-your-logo.png" // Asegúrate de poner la ruta correcta
            alt="CONINGENIERIA S.A.S" 
            className="h-12 object-contain"
          />
        </div>

        {/* Título Central */}
        <div className="w-1/3 border-r-2 border-black p-2 flex items-center justify-center text-center px-4 text-sm tracking-widest">
          INSPECCIÓN PREOPERACIONAL GRUA TELESCOPICA
        </div>

        {/* Info Derecha (Versión y Fechas) */}
        <div className="w-1/6 border-r-2 border-black flex flex-col">
          <div className="border-bottom border-black flex-1 p-1 flex items-center justify-center border-b-2">
            Versión {formatoSeleccionado.version || "02"}
          </div>
          <div className="border-bottom border-black flex-1 p-1 flex flex-col items-center justify-center border-b-2 text-[9px]">
            <span>Fecha de creación:</span>
            <span>{formatoSeleccionado.fechaCreacion || "13 JUNIO 2025"}</span>
          </div>
          <div className="border-bottom border-black flex-1 p-1 flex flex-col items-center justify-center border-b-2 text-[9px]">
            <span>Fecha actualización:</span>
            <span>{formatoSeleccionado.fechaActualizacion || "20 OCT 2025"}</span>
          </div>
          <div className="flex-1 p-1 flex flex-col items-center justify-center text-[9px]">
            <span>Fecha revisión:</span>
            <span>{formatoSeleccionado.fechaRevision || "20 OCT 2025"}</span>
          </div>
        </div>

        {/* Numeral SIG */}
        <div className="w-1/6 flex flex-col items-center justify-center p-2 text-center text-[10px] leading-tight">
          <span>Numeral de ubicación en SIG</span>
          <span className="mt-1">{formatoSeleccionado.numeralSIG || "4.4.3"}</span>
        </div>
      </div>

      {/* --- CUERPO DEL CHECKLIST --- */}
      <div className="space-y-6">
        {secciones.map((seccion: any) => (
          <div key={seccion.id} className="border border-gray-300 rounded-sm shadow-sm">
            <div className="bg-gray-100 p-2 border-b border-gray-300">
              <h3 className="font-bold text-sm">{seccion.nombre || seccion.titulo}</h3>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {seccion.items?.map((item: any) => (
                <label key={item.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors border-b border-gray-50 md:border-none">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) => setChecklistValue(seccion.id, item.id, e.target.checked)}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {item.nombre || item.descripcion}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold mb-2">Observaciones generales:</label>
        <textarea
          className="w-full p-3 border-2 border-gray-200 rounded focus:border-black outline-none transition-all"
          rows={4}
          placeholder="Escriba aquí sus observaciones..."
          value={formatoSeleccionado.observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChecklistPreoperacional;