
import { useState, useRef, useMemo } from 'react';
import { ChevronLeft, HelpCircle, RotateCcw, Check, X, PenTool } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useStepsStore } from '../../Store/useStepsStore';
import { useFormatoFormStore } from '../../Store/FormatoStore/useFormatoFormStore';
import SignatureCanvas from 'react-signature-canvas'; // Importar librería de firma
import toast from 'react-hot-toast';
import { usePreoperacionalStore } from '../../Store/usePreoperacionalStore';

const StepTwoCheck = ({ formato, datosPrevios }: { formato: any, datosPrevios: any }) => {
  const { generalData } = useFormatoFormStore();
  const { step, maxSteps, prevStep, canGoPrev } = useStepsStore();
  const { fecha } = usePreoperacionalStore();

  // Estados para la firma
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const sigCanvas = useRef<any>(null);

  const defaultChecklistValues = formato.checklist.reduce((acc: any, seccion: any) => {
    seccion.items.forEach((item: any) => {
      acc[item.id] = "B";
    });
    return acc;
  }, {});
  const { handleSubmit, watch, setValue, formState: { isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      respuestas: datosPrevios?.respuestas || defaultChecklistValues
    },
  });

  const watchRespuestas = watch("respuestas");
 

  const fechaIso = useMemo(() =>
    fecha ? fecha.toLocaleDateString("es-CO") : null
    , [fecha]);
  // Funciones de firma
  const clearSignature = () => sigCanvas.current.clear();
  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      toast.error("Por favor, estampe su firma antes de continuar");
      return;
    }

    // SOLUCIÓN AL ERROR: Accedemos al canvas nativo directamente
    // Esto evita el error de la función de recorte (trim)
    const canvas = sigCanvas.current.getCanvas();
    const base64 = canvas.toDataURL('image/png');

    setSignatureData(base64);
    setIsModalOpen(false);

    toast.success("Firma capturada correctamente");
  };
  const onSubmit = (checklistData: any) => {
    if (!signatureData) {
      toast.error("La firma del operador es obligatoria");
      return;
    }

    const payload = {
      fecha: new Date().toISOString(),
      fechaSeleccionada: fecha,
      equipoId: formato.id,
      nombreFormato: formato.nombreFormato,
      datosGenerales: generalData,
      respuestasChecklist: checklistData.respuestas,
      firmaOperador: signatureData, // Firma guardada en Base64
    };

    console.log("Final Payload para Firebase:", payload);
    toast.success('Inspección enviada correctamente');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 w-full relative">
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen m-4 border border-slate-200 rounded-lg overflow-hidden flex flex-col">

        {/* HEADER */}
        <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
          <button type="button" onClick={() => canGoPrev() && prevStep()} className="text-slate-500">
            {canGoPrev() ? <ChevronLeft size={24} /> : <X size={24} />}
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">Paso {step} / {maxSteps}</span>
            <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-0.5">Evaluación Técnica</h1>
          </div>
          <button type="button" className="text-rose-500/40"><HelpCircle size={20} /></button>
        </header>

        <main className="flex-1 w-full pb-20">
          <section className="px-6 py-10 bg-slate-50/50">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Checklist</h2>
            <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest mt-1">Seleccionada: {fechaIso}</p>
          </section>

          {/* RENDERIZADO DE CHECKLIST */}
          <div className="px-6 md:px-12 py-10 space-y-16">
            {formato.checklist.map((seccion: any, idx: number) => (
              seccion.id !== "horometro" && (
                <section key={seccion.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-1 rounded">0{idx}</span>
                    <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">{seccion.nombre}</h3>
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                  </div>

                  <div className="space-y-8">
                    {seccion.items.map((item: any) => (
                      <div key={item.id} className="flex items-end gap-4 group">
                        <span className="text-sm font-bold text-slate-700">{item.nombre}</span>
                        <div className="flex-1 border-b border-slate-100 mb-1.5"></div>
                        <div className="flex gap-1.5">
                          {['B', 'M', 'N/A'].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setValue(`respuestas.${item.id}`, opt, { shouldValidate: true })}
                              className={`w-10 h-10 rounded-lg text-[10px] font-black transition-all border
                                ${watchRespuestas?.[item.id] === opt
                                  ? 'bg-slate-900 border-slate-900 text-white'
                                  : 'bg-white border-slate-200 text-slate-400'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            ))}

            {/* SECCIÓN DE FIRMA */}
            <section className="pt-10 space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">Firma del Responsable</h3>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>

              <div
                onClick={() => setIsModalOpen(true)}
                className="w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer overflow-hidden"
              >
                {signatureData && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Firma Registrada</p>
                    {/* Añadimos un pequeño mix-blend-mode para que se vea limpia */}
                    <img
                      src={signatureData}
                      alt="Firma"
                      className="mx-auto h-24 object-contain mix-blend-multiply transition-transform hover:scale-105"
                    />
                    <p className="text-[9px] text-slate-400 italic tracking-widest">Toca para corregir</p>
                  </div>
                )}
                {!signatureData && (
                  <div className="py-6">
                    <PenTool className="mx-auto text-slate-300 mb-2" size={32} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toque aquí para firmar</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-40 flex justify-end">
          <button
            type="submit"
            disabled={!isValid || !signatureData}
            className="group flex items-center disabled:opacity-40 gap-4 bg-emerald-600 text-white px-10 py-4 rounded-full hover:bg-emerald-700 transition-all shadow-lg"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Finalizar e Enviar</span>
            <Check size={18} />
          </button>
        </footer>
      </form>

      {/* MODAL DE FIRMA (Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">Estampe su firma</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X /></button>
            </div>

            <div className="bg-slate-50 m-4 border border-slate-200 rounded-xl">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                canvasProps={{ className: "w-full h-64 cursor-crosshair" }}
              />
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={clearSignature}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-slate-200 text-[10px] font-bold uppercase text-slate-500 hover:bg-slate-50"
              >
                <RotateCcw size={16} /> Limpiar
              </button>
              <button
                type="button"
                onClick={saveSignature}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase hover:bg-slate-800"
              >
                <Check size={16} /> Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepTwoCheck;