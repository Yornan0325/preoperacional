import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { useSelectedEquipoStore } from "../../Store/EquipoStore/selectedEquipoStore";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import "./CalendarCustomStyles.css";
import useModalStore from "../../Store/modalStore";

const Calendario = () => {
  const navigate = useNavigate();
  const { equipoActivo } = useSelectedEquipoStore();
  const { registros, fecha, setFecha } = usePreoperacionalStore();
  const { closeModal } = useModalStore();
  const registrosMap = useMemo(() => {
    if (!equipoActivo) return {};
    return registros
      .filter(r => r.equipoId === equipoActivo.id)
      .reduce((acc, reg) => {
        acc[reg.fecha] = reg;
        return acc;
      }, {} as Record<string, any>);
  }, [registros, equipoActivo]);

  const getRegistro = useCallback((date: Date) => {
    const iso = date.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
    return registrosMap[iso];
  }, [registrosMap]);

  if (!equipoActivo) return null;

  // Clase CSS dinámica para el fondo del día
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "tile-default";

    const reg = getRegistro(date);
    if (!reg) return "tile-default";

    const estados: Record<string, string> = {
      APROBADO: "tile-aprobado",
      PENDIENTE: "tile-pendiente",
      RECHAZADO: "tile-rechazado",
    };

    return estados[reg.estado?.toUpperCase()] || "tile-default";
  };

  // Contenido visual dentro del día (Puntitos y Badge CIS)
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const reg = getRegistro(date);
    if (!reg) return null;

    return (
      <div className="flex flex-col items-center mt-1 pointer-events-none">
        <span
          className={`text-[7px] font-black tracking-tighter leading-none px-1 py-0.5 rounded-[2px] border ${reg.firmaCis
            ? "text-blue-600 bg-blue-50 border-blue-100"
            : "text-slate-300 bg-transparent border-slate-100"
            }`}
        >
          CIS
        </span>
        <div className={`w-1 h-1 rounded-full mt-1 ${reg.estado === "RECHAZADO" ? "bg-rose-500" : "bg-current opacity-40"
          }`} />
      </div>
    );
  };

  const handleDayClick = (date: Date) => {
    setFecha(date);
    navigate(`preoperacional/${equipoActivo.placa}`);

    setTimeout(() => {
      closeModal();
    }, 2000);

  };

  return (
    <div className="calendar-container">
      <Calendar
        value={fecha || new Date()}
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="custom-react-calendar"
        locale="es-ES"
        minDetail="month" // Evita que el usuario navegue a vistas de año/siglo innecesarias
      />
    </div>
  );
};

export default Calendario;