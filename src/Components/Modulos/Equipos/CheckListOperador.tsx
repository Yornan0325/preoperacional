import PageBreadcrumb from "../../Comun/PageBreadCrumb";
import { useSelectedEquipoStore } from "../../Store/EquipoStore/selectedEquipoStore";
import { useNavigate } from "react-router-dom";
import { useStepsStore } from "../../Store/useStepsStore";
import { useEffect } from "react";
import StepOneCheck from "./StepOneCheck";
import StepTwoCheck from "./StepTwoCheck";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import { formatoFirebaseData } from "../../data/formatofirebaseData";

const CheckListOperador = () => {
    const { equipoActivo } = useSelectedEquipoStore();
    const { fecha, registros } = usePreoperacionalStore();
    const { step, setMaxSteps } = useStepsStore();
    const navigate = useNavigate();

    const steps = [
        StepOneCheck,
        StepTwoCheck,
    ];

    const handleVolver = () => {
        navigate(`/equipo`);
    };
    // 1. Enlace con el formato (Usando la propiedad del equipo)
    const formatoDefinicion = formatoFirebaseData.find(f => f.id === equipoActivo?.relacionFormato);
    // 2. Cargar datos si ya existen para esta fecha
    const fechaISO = fecha?.toLocaleDateString("en-CA");
    const datosExistentes = registros.find(r => r.equipoId === equipoActivo?.id && r.fecha === fechaISO);

    useEffect(() => {
        setMaxSteps(steps.length); // Se configura automáticamente
    }, [setMaxSteps]);
    if (!equipoActivo) return <div>No hay equipo seleccionado</div>;
    if (!formatoDefinicion) return <div>El equipo no tiene un formato asignado.</div>;
    const CurrentStep = steps[step - 1];
    return (
        <>
            <PageBreadcrumb pageTitle="Preoperacional" />
            <div className="flex justify-between items-center">
                <button
                    className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
                    disabled={!equipoActivo?.id}
                    onClick={handleVolver}
                >
                    Volver al calendario
                </button>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                    <h1>{equipoActivo?.nombre}|{equipoActivo?.id}</h1>
                </div>
            </div>
            <div className="antialiased text-slate-900 bg-slate-50 min-h-screen">
                <div>
                    {/* <PreoperacionalDia /> */}
                    <CurrentStep
                        formato={formatoDefinicion}
                        datosPrevios={datosExistentes}
                    />
                </div>
            </div>
        </>
    );
};

export default CheckListOperador;