import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback, useEffect } from "react";
import { useSelectedEquipoStore } from "../../Store/EquipoStore/selectedEquipoStore";
import { usePreoperacionalStore } from "../../Store/usePreoperacionalStore";
import "./CalendarCustomStyles.css";
import useModalStore from "../../Store/modalStore";

// IMPORTACIÓN DEL NUEVO COMPONENTE DE ESTADOS
import { EstadoDiaCalendario } from "./EstadoDiaCalendario";

interface CalendarioProps {
  userRole?: string;
}

const Calendario: React.FC<CalendarioProps> = ({ userRole = "OPERADOR" }) => {
  const navigate = useNavigate();
  const { equipoActivo } = useSelectedEquipoStore();
  const { registros, fecha, seleccionarDia, cargarRegistros, toggleFechaSeleccionada, fechasSeleccionadas } = usePreoperacionalStore();
  const { closeModal } = useModalStore();

  const isOperador = userRole === "OPERADOR";

  useEffect(() => {
    if (equipoActivo?.id) {
      const hoy = new Date();
      const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
      const anio = hoy.getFullYear().toString();
      console.log("equipoActivo.id", equipoActivo.id);
      console.log("mes", mes);
      console.log("anio", anio);
      cargarRegistros(equipoActivo.id, mes, anio);
    }
  }, [equipoActivo?.id, cargarRegistros]);

  const onActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (activeStartDate && equipoActivo?.id) {
      const mes = (activeStartDate.getMonth() + 1).toString().padStart(2, '0');
      const anio = activeStartDate.getFullYear().toString();
      cargarRegistros(equipoActivo.id, mes, anio);
    }
  };

  const registrosMap = useMemo(() => {
    if (!equipoActivo) return {};
    return registros
      .filter(r => r.equipoId === equipoActivo.id)
      .reduce((acc, reg) => {
        acc[reg.fechaInspeccion] = reg;
        return acc;
      }, {} as Record<string, any>);
  }, [registros, equipoActivo]);

  const getRegistro = useCallback((date: Date) => {
    const iso = date.toLocaleDateString("en-CA"); // Formato YYYY-MM-DD
    return registrosMap[iso];
  }, [registrosMap]);

  if (!equipoActivo) return null;

  // Clase CSS dinámica para el fondo del día (Mantenemos tu lógica de colores)
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "tile-default";
    const iso = date.toLocaleDateString("en-CA");
    const reg = registrosMap[iso];

    let classes = "";

    if (reg) {
      const estados: Record<string, string> = {
        APROBADO: "tile-aprobado",
        PENDIENTE: "tile-pendiente",
        RECHAZADO: "tile-rechazado",
      };
      classes = `${estados[reg.estado?.toUpperCase()] || "tile-default"} tile-has-record`;
    } else {
      classes = "tile-default";
    }

    // Resaltar si está seleccionado (Solo para SISO/ADMIN)
    if (!isOperador && fechasSeleccionadas.includes(iso)) {
      classes += " tile-selected ring-2 ring-blue-500 ring-inset shadow-inner bg-blue-50/50";
    }

    return classes;
  };

  // NUEVO CONTENIDO VISUAL: Integra los 3 roles
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const reg = getRegistro(date);
    if (!reg) return null;

    // Extraemos el estado de las firmas del registro de Firebase
    // Si no existen (registros antiguos), pasamos false por defecto
    const firmas = {
      inspector: reg.firmas?.inspector?.firmado || false,
      siso: reg.firmas?.siso?.firmado || false,
      copas: reg.firmas?.copas?.firmado || false
    };

    return (
      <div className="flex flex-col items-center w-full mt-auto pb-1">
        {/* Los iconos de firmas ahora tienen su propio espacio debajo del número */}
        <EstadoDiaCalendario firmas={firmas} />

        {/* Alerta de RECHAZADO: Ultra compacto */}
        {reg.estado === "RECHAZADO" && (
          <div className="mt-0.5 px-1 py-0.5 bg-rose-50 rounded-full ring-1 ring-rose-200">
            <div className="w-1 h-1 rounded-full bg-rose-600 animate-pulse" />
          </div>
        )}
      </div>
    );
  };

  const handleDayClick = (date: Date) => {
    const iso = date.toLocaleDateString("en-CA");
    const reg = registrosMap[iso];

    if (isOperador) {
      // El operador puede abrir cualquier día para llenar inspección
      seleccionarDia(equipoActivo.id, date);
      navigate(`preoperacional/${equipoActivo.placa}`);
      setTimeout(() => closeModal(), 500);
    } else {
      // SISO/ADMIN solo pueden seleccionar días que ya tengan un registro del operador
      if (reg) {
        toggleFechaSeleccionada(iso);
      }
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        value={fecha || new Date()}
        onClickDay={handleDayClick}
        onActiveStartDateChange={onActiveStartDateChange}
        tileClassName={tileClassName}
        tileContent={tileContent}
        className="custom-react-calendar"
        locale="es-ES"
        minDetail="month"
      />
    </div>
  );
};

export default Calendario;