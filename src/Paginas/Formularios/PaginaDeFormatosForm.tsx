import { useEffect } from "react";
import PageBreadcrumb from "../../Components/Comun/PageBreadCrumb";
// import Stepper from "../../Components/Modulos/Stepper";
import StepOneFormato from "../../Components/Modulos/Formularios/FormatosForm/StepOneFormato";
import StepTwoFormato from "../../Components/Modulos/Formularios/FormatosForm/StepTwoFormato";
import { useStepsStore } from "../../Components/Store/useStepsStore";
import { useNavigate } from "react-router-dom";
import { LucideArrowLeft } from "lucide-react";
// import StepIndicator from "../../Components/Comun/StepIndicator";

// ============================================
// TIPOS
// ============================================

/**
 * Tipo para los componentes de paso
 */
type StepComponent = React.ComponentType;

/**
 * Configuración de cada paso
 */
// interface StepConfig {
//     component: StepComponent;
//     title: string;
//     description?: string;
// }

// ============================================
// CONFIGURACIÓN DE PASOS
// ============================================

/**
 * Array de componentes de pasos
 * Paso 1: Información general del formato
 * Paso 2: Configuración del checklist
 */
const steps: StepComponent[] = [
    StepOneFormato,   // Crea FormatoGeneral
    StepTwoFormato,   // Configura ChecklistFormato
];

// Versión extendida con metadata (opcional)
// const stepsExtended: StepConfig[] = [
//     {
//         component: StepOneFormato,
//         title: "Información General",
//         description: "Datos básicos del formato de inspección"
//     },
//     {
//         component: StepTwoFormato,
//         title: "Configuración de Checklist",
//         description: "Define las secciones y campos del checklist"
//     },
// ];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PaginaDeFormatos = () => {
    const { step, setMaxSteps, resetSteps } = useStepsStore();
    const navigate = useNavigate();
    // Configurar cantidad de pasos al montar
    useEffect(() => {
        setMaxSteps(steps.length);

        // Opcional: Resetear al desmontar para evitar problemas de navegación
        return () => {
            resetSteps();
        };
    }, [setMaxSteps, resetSteps]);


    // Obtener el componente actual basado en el paso
    const CurrentStep = steps[step - 1];

    // Validación de seguridad (por si el step está fuera de rango)
    if (!CurrentStep) {
        console.error(`Step ${step} no existe. Total de pasos: ${steps.length}`);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Error de navegación
                    </h2>
                    <p className="text-slate-600">
                        El paso {step} no existe.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <>
            <PageBreadcrumb
                pageTitle="Crear Formato de Inspección"
            />
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

export default PaginaDeFormatos;