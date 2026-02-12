import { useEffect } from "react";
import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
import StepOneEquipoForm from "../../Components/Modulos/Formularios/EquiposForm/StepOneEquipoForm";
import { useStepsStore } from "../../Components/Store/useStepsStore";
import { useNavigate } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";

const steps = [
  StepOneEquipoForm
];
const PaginaDeEquiposForm = () => {
  const { step, setMaxSteps } = useStepsStore();



  useEffect(() => {
    setMaxSteps(steps.length);
  }, [setMaxSteps]);
  const navigate = useNavigate();

  const CurrentStep = steps[step - 1];
  return (
    <>
      <PageBreadcrumb pageTitle="Equipos" />
      <div className="flex items-center w-10 h-10 justify-center bg-blue-100 rounded-full">
          <button onClick={() => navigate(-1)} className=" text-blue-600"><LucideArrowLeft /></button>
      </div>
      <div className="antialiased text-slate-900 bg-slate-50 min-h-screen">

        <div>
          <CurrentStep />
        </div>
      </div>
    </>
  );
};

export default PaginaDeEquiposForm;