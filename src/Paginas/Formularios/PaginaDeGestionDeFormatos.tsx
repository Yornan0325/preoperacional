import { FileText } from "lucide-react";
import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
import CardFormato from "../../Components/Modulos/Formularios/Formato/CardFormato";
import { useFormatoGetDataStore } from "../../Components/Store/FormatoStore/formatoGetDataStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaginaDeGestionDeFormatos = () => {
  const { formatoData, loading, cargarDesdeFirebase } = useFormatoGetDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const cargarDatos = async () => {
      if (formatoData.length === 0 && !loading && mounted) {
        await cargarDesdeFirebase();
      }
    };

    cargarDatos();

    return () => {
      mounted = false;
    };
  }, [formatoData, loading, cargarDesdeFirebase]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <>
      <PageBreadcrumb pageTitle="Formatos" />
      <div className="p-4 border border-1 border-slate-200 rounded-lg">

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            onClick={() => navigate(`/formulario/equipo`)}
            className="cursor-pointer rounded-xl border border-slate-400 bg-white p-5 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 line-clamp-1">Equipo</h3>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded uppercase tracking-wider font-bold">
                Formulario
              </span>
              <span className="text-xs text-blue-600 font-medium">Ver formato →</span>
            </div>
          </div>

          <div
            onClick={() => navigate(`/formulario/formatos`)}
            className="cursor-pointer rounded-xl border border-slate-400 bg-white p-5 shadow-sm hover:shadow-md transition group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 line-clamp-1">Formato</h3>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
              <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-1 rounded uppercase tracking-wider font-bold">
                Formulario
              </span>
              <span className="text-xs text-blue-600 font-medium">Ver formato →</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {formatoData.length === 0 ? (
          <div className="text-center border-1 border-dashed rounded-lg">
            <p className="text-gray-400">No hay formatos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {formatoData.map((formato) => (
              <CardFormato key={formato.id} formato={formato} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PaginaDeGestionDeFormatos;
