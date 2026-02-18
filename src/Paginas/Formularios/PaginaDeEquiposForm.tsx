 import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
 import { useNavigate } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";
import EquipoForm from "../../Components/Modulos/Formularios/EquiposForm/EquipoForm";

 
const PaginaDeEquiposForm = () => {
  const navigate = useNavigate();

 
  return (
    <>
      <PageBreadcrumb pageTitle="Equipos" />
      <div className="flex items-center w-10 h-10 justify-center bg-blue-100 rounded-full">
          <button onClick={() => navigate(-1)} className=" text-blue-600"><LucideArrowLeft /></button>
      </div>
      <div className="antialiased text-slate-900 bg-slate-50 min-h-screen">

        <div>
           
          <EquipoForm />
        </div>
      </div>
    </>
  );
};

export default PaginaDeEquiposForm;