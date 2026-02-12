import { useForm } from "react-hook-form";
import { useEquipoGetDataStore } from "../../Store/EquipoStore/equipoGetDataStore";
import useModalStore from "../../Store/modalStore";
import IconLucide from "../../Icon/IconLucide";
import { Modal } from "../../ui/Modal";
import { ESTADOS_EQUIPO_OPTIONS } from "../../Constants/opciones";
import { useEffect } from "react";
import type { Equipo, EstadoEquipo } from "../../typesScript/equipoFormType";

interface Props {
  equipo: Equipo;
  estados?: {
    value: EstadoEquipo;
    label: string;
    icon?: string;
  }[];
  
}

const EditarEquipoModal = ({ equipo, estados = ESTADOS_EQUIPO_OPTIONS as any }: Props) => {
  const { actualizarEquipo } = useEquipoGetDataStore();
  const { isOpen, activeModal, closeModal } = useModalStore();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Partial<Equipo>>({
    defaultValues: equipo,
  });

  useEffect(() => {
    if (isOpen && activeModal === `editarEquipo-${equipo}`) {
      reset(equipo);
    }
  }, [isOpen, activeModal, equipo, reset]);

  const onSubmit = (data: Partial<Equipo>) => {
    actualizarEquipo(equipo.id, data);
    closeModal();
  };

  const inputStyles =
    "w-full border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 text-slate-700 dark:text-gray-200 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400";

  const labelStyles =
    "block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 ml-1 uppercase tracking-wider";

  return (
    <Modal
      isOpen={isOpen && activeModal === `editarEquipo-${equipo.id}`}
      onClose={closeModal}
    >
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <IconLucide name="userPen" size={24} strokeWidth={1} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Editar Equipo
          </h3>
          <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <span className="opacity-60">ID REFERENCIA:</span>
            <code className="bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">
              {equipo.id}
            </code>
          </p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className={labelStyles}>Nombre del Equipo</label>
          <input
            className={inputStyles}
            placeholder="Ej. Excavadora CAT-320"
            {...register("nombre")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Proyecto</label>
            <input
              className={inputStyles}
              placeholder="Nombre del proyecto"
              {...register("proyecto")}
            />
          </div>

          <div>
            <label className={labelStyles}>Ubicación</label>
            <input
              className={inputStyles}
              placeholder="Zona o sector"
              {...register("ubicacion")}
            />
          </div>
        </div>

        <div>
          <label className={labelStyles}>Estado Operativo</label>

          <div className="relative">
            <select
              className={`${inputStyles} appearance-none`}
              {...register("estado")}
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.icon} {estado.label}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <IconLucide name="chevronDown" size={16} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="submit"
            className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <IconLucide size={20} name="plus" strokeWidth={1} />
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarEquipoModal;
