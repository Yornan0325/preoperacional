 import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
 
import EquipoForm from "../../Components/Modulos/Formularios/EquiposForm/EquipoForm";

 
const PaginaDeEquiposForm = () => {
 
 
  return (
    <>
      <PageBreadcrumb pageTitle="Equipos" />
  
      <div className="antialiased min-h-screen">
          <EquipoForm />
      </div>
    </>
  );
};

export default PaginaDeEquiposForm;