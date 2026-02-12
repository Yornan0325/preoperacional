import { useEffect } from "react";
import { useParams } from "react-router-dom";
import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
import { useFormatoGetDataStore } from "../../Components/Store/FormatoStore/formatoGetDataStore";
import useSelectedFormatoStore from "../../Components/Store/FormatoStore/selectedFormatoStore";
// import ChecklistPreoperacional from "../../Components/Modulos/Gestion/Formato/ChecklistPreoperacional";
import EditorChecklist from "../../Components/Modulos/Formularios/Formato/SeccionItems";

const PaginaEditorFormato = () => {
  const { id } = useParams<{ id: string }>();

  const { formatoData } = useFormatoGetDataStore();
  const setFormato = useSelectedFormatoStore((s) => s.setFormato);
  // const formatoSeleccionado = useSelectedFormatoStore((s) => s.formato);
  useEffect(() => {
    if (!id || formatoData.length === 0) return;

    const formatoSeleccionado = formatoData.find((f) => f.id === id);

    if (formatoSeleccionado) {
      setFormato(formatoSeleccionado);
    }
  }, [id, formatoData, setFormato]);

  return (
    <>
      <PageBreadcrumb pageTitle="Formato Preoperacional" />

      <div className="antialiased text-slate-900 min-h-screen bg-slate-100 p-4">
        <EditorChecklist />
        {/* <ChecklistPreoperacional formatoSeleccionado={formatoSeleccionado} /> */}
      </div>
    </>
  );
};

export default PaginaEditorFormato;
