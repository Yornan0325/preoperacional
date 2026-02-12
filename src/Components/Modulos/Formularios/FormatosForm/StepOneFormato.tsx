import { ChevronRight, Info, X, ClipboardCheck, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useFormatoFormStore } from '../../../Store/FormatoStore/useFormatoFormStore';
import { useStepsStore } from '../../../Store/useStepsStore';
import type { FormatoGeneral } from '../../../typesScript/preoperacionalType';

// ============================================
// TIPOS PARA EL FORMULARIO
// ============================================
/**
 * Tipo para el formulario del Step 1
 * Mapea 1:1 con FormatoGeneral
 */
type StepOneFormData = {
  nombreFormato: string;
  version?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaRevision?: string;
  numeralUbicacion?: string;
};

// Tipo para los campos del formulario
interface FormField {
  id: keyof StepOneFormData;
  label: string;
  placeholder?: string;
  span: string;
  type: 'text' | 'date' | 'string';
  required?: boolean;
}

// ============================================
// CONFIGURACIÓN DE CAMPOS
// ============================================
const formFields: FormField[] = [
  {
    id: 'version',
    label: 'Versión',
    placeholder: 'Ej. 1.0',
    span: 'col-span-2',
    type: 'text',
  },
  {
    id: 'fechaCreacion',
    label: 'Fecha de Creación',
    span: 'col-span-1',
    type: 'date',
  },
  {
    id: 'fechaActualizacion',
    label: 'Fecha de Actualización',
    span: 'col-span-1',
    type: 'date',
  },
  {
    id: 'fechaRevision',
    label: 'Fecha de Revisión',
    span: 'col-span-1',
    type: 'date',
  },
  {
    id: 'numeralUbicacion',
    label: 'Numeral / Ubicación en el sig',
    placeholder: 'Ej. 2040',
    span: 'col-span-1',
    type: 'text', // Cambiado de 'string' a 'text'
  },
];

const StepOneFormato = () => {
  const { updateFormatoGeneral, generalData } = useFormatoFormStore();
  const { step, maxSteps, nextStep, prevStep, canGoPrev } = useStepsStore();

  // Valores por defecto con fecha actual
  const defaultValues: StepOneFormData = {
    nombreFormato: generalData?.nombreFormato || '',
    version: generalData?.version || '1.0',
    fechaCreacion: generalData?.fechaCreacion || new Date().toISOString().split('T')[0],
    fechaActualizacion: generalData?.fechaActualizacion || new Date().toISOString().split('T')[0],
    fechaRevision: generalData?.fechaRevision || '',
    numeralUbicacion: generalData?.numeralSIG || '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<StepOneFormData>({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: StepOneFormData): void => {
    // Convertir a FormatoGeneral con estado inicial
    const formatoGeneral: Partial<FormatoGeneral> = {
      nombreFormato: data.nombreFormato,
      version: data.version,
      fechaCreacion: data.fechaCreacion,
      fechaActualizacion: data.fechaActualizacion,
      fechaRevision: data.fechaRevision,
      numeralSIG: data.numeralUbicacion,
      estado: 'ACTIVO', // Estado inicial
    };

    updateFormatoGeneral(formatoGeneral);
    nextStep();
  };

  const handleGoBack = () => {
    if (canGoPrev()) {
      prevStep();
    } else {
      // Opcional: cerrar el modal o volver a la lista de formatos
      console.log('No se puede retroceder más');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-white flex flex-col font-sans text-slate-900 w-full"
    >
      {/* HEADER MINIMALISTA */}
      <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
        <button
          type="button"
          className="text-slate-500 hover:text-slate-900 transition-colors"
          onClick={handleGoBack}
        >
          {canGoPrev() ? <ChevronLeft size={24} /> : <X size={24} />}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Información General
          </span>
          <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-0.5">
            Paso {step} / {maxSteps}
          </h1>
        </div>

        <button
          type="button"
          className="text-rose-500/40 hover:text-rose-500 transition-colors"
        >
          <Info size={20} />
        </button>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
          <div
            className="h-full bg-rose-600 transition-all duration-500"
            style={{ width: `${(step / maxSteps) * 100}%` }}
          ></div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* HERO SECTION - Branding */}
        <section className="px-6 py-12 md:px-12 bg-slate-50/50">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none">
            Crear Formato

          </h2>
          <p className="text-sm text-slate-500 mt-4">
            Define la información general del formato que usarás para inspecciones
          </p>
        </section>

        <div className="px-6 md:px-12 py-10 space-y-16">
          {/* SECCIÓN: FORMATO */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">
                01
              </span>
              <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Tipo de Formato
              </h3>
              <div className="h-[1px] flex-1 bg-slate-100"></div>
            </div>

            <div className="relative group">
              <label htmlFor="nombreFormato" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block group-focus-within:text-rose-600 transition-colors">
                Nombre del Formato
              </label>
              <div className="flex items-center gap-3 border-b border-slate-200 group-focus-within:border-rose-600 transition-all pb-2">
                <ClipboardCheck
                  size={20}
                  className="text-slate-300 group-focus-within:text-rose-500 transition-colors"
                />
                <input
                  id="nombreFormato"
                  {...register('nombreFormato', {
                    required: 'El nombre del formato es obligatorio',
                    minLength: { value: 3, message: 'El nombre del formato debe tener al menos 3 caracteres' },
                  })}
                  placeholder="Ej. GRÚA TELESCÓPICA"
                  className="w-full bg-transparent text-2xl font-light text-slate-800 outline-none placeholder:text-slate-200"
                />
              </div>
              {errors.nombreFormato && (
                <span className="text-[10px] text-rose-500 font-bold mt-1 uppercase italic">
                  {errors.nombreFormato.message}
                </span>
              )}
            </div>
          </section>

          {/* SECCIÓN: ESPECIFICACIONES */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">
                02
              </span>
              <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Especificaciones
              </h3>
              <div className="h-[1px] flex-1 bg-slate-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {formFields.map((field: FormField) => (
                <div key={field.id} className={`${field.span} group flex flex-col`}>
                  <label htmlFor={field.id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 group-focus-within:text-slate-900 transition-colors">
                    {field.label} {field.required && '*'}
                  </label>

                  <input
                    id={field.id}
                    type={field.type}
                    {...register(field.id, {
                      required: field.required ? 'Este campo es obligatorio' : false,
                    })}
                    placeholder={field.placeholder}
                    className="text-xl font-light text-slate-800 bg-transparent border-b border-slate-200 focus:border-slate-900 outline-none pb-2 transition-all placeholder:text-slate-300"
                  />
                  {errors[field.id] && (
                    <span className="text-[10px] text-rose-500 font-bold mt-1 uppercase italic">
                      {errors[field.id]?.message as string}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER FIJO */}
      <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-50 flex justify-end">
        <div className="text-xs text-slate-400">
          Los campos marcados con * son obligatorios
        </div>
        <button
          type="submit"
          className="group flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 text-white px-12 py-4 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 w-full md:w-auto justify-center"
          disabled={!isValid}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Siguiente sección
          </span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </footer>
    </form>
  );
};

export default StepOneFormato;