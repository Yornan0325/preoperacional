import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Trash2,
  Hash,
  Type,
  CheckSquare,
  List,
  ChevronRight,
  ChevronLeft,
  Info,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import type {
  Section,
  ChecklistItem,
  StepTwoForm,
  ItemType,
  ToolbarButton,
  InspectionPayload
} from '../../../typesScript/formatoFormtype';
import { useStepsStore } from '../../../Store/useStepsStore';
import { useFormatoFormStore } from '../../../Store/FormatoStore/useFormatoFormStore';



const StepTwoFormato = () => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const { step, maxSteps, nextStep, prevStep, canGoPrev } = useStepsStore();
  const [options, setOptions] = useState<string[]>(['']);
  const [selectConfigItem, setSelectConfigItem] = useState<{
    sectionId: number;
    itemId: string;
  } | null>(null);
  const {
    checklist,
    checklistTitle,
    addItemToSection,
    addSection,
    updateItemLabel,
    removeItem,
    removeSection,
    updateItemOptions,

  } = useFormatoFormStore();

  const {
    register,
    formState: { isValid },
    handleSubmit,
    setValue
  } = useForm<StepTwoForm>({
    defaultValues: {
      title: checklistTitle,
    },
  });

  useEffect(() => {
    setValue('title', checklistTitle);
    checklist.forEach((section: Section) =>
      section.items.forEach((item: ChecklistItem) => {
        if (item.value !== undefined) {
          setValue(`values.${item.id}`, item.value);
        }
      })
    );
  }, [checklist, setValue]);

  const onSubmit = (data: StepTwoForm) => {
    // if (!data.title) {
    //   toast.error('Debes ingresar un título para el formato dos');
    //   return;
    // }

    if (checklist.length === 0) {
      toast.error('Debes crear al menos una sección');
      return;
    }

    if (step < maxSteps) {
      // No es el último paso, entonces avanzar
      nextStep();
    } else {
      // Es el último paso, enviar
      const { generalData } = useFormatoFormStore.getState();

      const payload: InspectionPayload = {
        createdFormat: new Date().toISOString(),
        ...generalData,
        data: checklist.map((section: Section) => ({
          seccion: section.title,
          items: section.items.map((item: ChecklistItem) => ({
            pregunta: item.label,
            tipo: item.type,
            opciones: item.type === 'select' ? item.options : undefined,
            valorInicial: data.values[item.id] || item.value
          }))
        }))
      };

      console.log(JSON.stringify(payload, null, 2));
      alert("Inspección enviada. Revisa la consola.");
    }
  };
  // Define los botones de la toolbar con tipos
  const toolbarButtons: ToolbarButton[] = [
    { icon: List, type: 'select', label: 'Lista' },
    { icon: CheckSquare, type: 'checkbox', label: 'Check' },
    { icon: Hash, type: 'number', label: 'Num' },
    { icon: Type, type: 'text', label: 'Texto' }
  ];
  // const handleAddItem = (sectionId: number, label: string, type: ItemType): void => {
  //   addItemToSection(sectionId, label, type);
  // };

  // const handleAddItem = (sectionId: number, label: string, type: ItemType) => {
  //   const newItemId = addItemToSection(sectionId, label, type);

  //   if (type === 'select') {
  //     setSelectConfigItem({ sectionId, itemId: newItemId });
  //     setOptions(['']);
  //   }
  // };
  const handleAddItem = (sectionId: number, label: string, type: ItemType) => {
    const newItemId = addItemToSection(sectionId, label, type);

    if (type === 'select') {
      setSelectConfigItem({ sectionId, itemId: newItemId });
      setOptions(['']);
    }
  };
  // const handleAddItem = (sectionId: number, label: string, type: ItemType) => {
  //   const newItemId = addItemToSection(sectionId, label, type);

  //   if (type === 'select') {
  //     // esperamos al item recién creado
  //     setTimeout(() => {
  //       const section = checklist.find(s => s.id === sectionId);
  //       const lastItem = section?.items.at(-1);
  //       if (lastItem) {
  //         setSelectConfigItem({ sectionId, itemId: lastItem.id });
  //         setOptions(['']);
  //       }
  //     }, 0);
  //   }
  // };

  const handleCreateSection = (): void => {
    if (newSectionName.trim()) {
      addSection(newSectionName);
      setNewSectionName('');
      setIsModalOpen(false);
    }
  };




  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-white flex flex-col font-sans text-slate-900 w-full">
      {/* HEADER MINIMALISTA - Edge-to-Edge */}
      <header className="px-6 py-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50">
        <button
          type="button"
          className="text-slate-500 hover:text-slate-900 transition-colors"
          onClick={() => {
            if (canGoPrev()) {
              prevStep();
            } else {
            }
          }}
        >
          {canGoPrev() ? <ChevronLeft size={24} /> : <X size={24} />}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold tracking-[0.3em] text-slate-400 uppercase">Configuración</span>
          <h1 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mt-0.5">
            Paso {step} / {maxSteps}
          </h1>
        </div>

        <button type="button" className="text-rose-500/40 hover:text-rose-500 transition-colors">
          <Info size={20} />
        </button>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-100">
          <div
            className="h-full bg-rose-600 transition-all duration-500"
            style={{ width: `${(step / maxSteps) * 100}%` }}
          ></div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="px-4 py-4 md:px-12  flex flex-col md:flex-row justify-between items-end gap-6">
          -
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <Plus size={16} /> Nueva Sección
          </button>
        </section>

        <div className="px-6 md:px-12 py-12 space-y-16">
          {checklist.map((section: Section, sIdx: number) => (
            <section key={section.id} className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">0{sIdx + 1}</span>
                <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-[0.2em]">{section.title}</h3>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <button
                  type="button"
                  onClick={() => removeSection(section.id) /* Función para borrar sección si aplica */}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {section.items.map((item: ChecklistItem) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-slate-50 group hover:bg-slate-50/30 transition-colors px-2 rounded-lg">
                    <div className="flex-1">
                      {editingItemId === item.id ? (
                        <input
                          value={item.label}
                          autoFocus
                          onChange={e => updateItemLabel(section.id, item.id, e.target.value)}
                          onBlur={() => setEditingItemId(null)}
                          className="w-full border-b border-rose-400 outline-none text-lg font-medium text-slate-800 bg-transparent"
                        />
                      ) : (
                        <span
                          onDoubleClick={() => setEditingItemId(item.id)}
                          className="text-lg font-medium text-slate-700 cursor-pointer hover:text-rose-600 transition-colors"
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Inputs dinámicos con estilo de la anterior */}
                      <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 min-h-[40px] flex items-center shadow-sm">
                        {item.type === 'select' && (
                          <select {...register(`values.${item.id}`)}>
                            <option value="">Evaluar...</option>

                            {item.options?.length ? (
                              item.options.map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))
                            ) : (
                              <option disabled value="">
                                ⚠ Sin opciones
                              </option>
                            )}
                          </select>
                        )}
                        {item.type === 'number' && (
                          <input type="number" {...register(`values.${item.id}`)} placeholder="00" className="w-12 bg-transparent text-center font-black text-rose-600 outline-none" />
                        )}
                        {item.type === 'checkbox' && (
                          <input type="checkbox" {...register(`values.${item.id}`)} className="w-5 h-5 accent-emerald-500" />
                        )}
                        {item.type === 'text' && (
                          <input type="text" {...register(`values.${item.id}`)} placeholder="..." className="bg-transparent px-2 text-sm outline-none w-32" />
                        )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button"
                          onClick={() => setEditingItemId(item.id)} className="p-2 text-slate-400 hover:text-slate-900">
                          <Type size={16} />
                        </button>
                        <button type="button"
                          onClick={() => removeItem(section.id, item.id)}
                          className="p-2 text-slate-400 hover:text-rose-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOOLBAR PARA AÑADIR ITEMS */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-dashed border-slate-200">
                {toolbarButtons.map((btn: ToolbarButton) => (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => handleAddItem(section.id, btn.label, btn.type)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <btn.icon size={14} /> {btn.label}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        {/* MODAL CONFIGURACIÓN SELECT */}
        {selectConfigItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white text-sm font-bold uppercase tracking-widest">Configurar Opciones</h3>
                <button
                  type="button"
                  onClick={() => setSelectConfigItem(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 mb-2">
                  Agrega las opciones para el campo de selección.
                </p>

                {/* Lista de opciones */}
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                          placeholder={`Opción ${index + 1}`}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:border-slate-900 focus:ring-2 focus:ring-slate-900 outline-none transition-all"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (options.length > 1) {
                            setOptions(options.filter((_, i) => i !== index));
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botón agregar opción */}
                <button
                  type="button"
                  onClick={() => setOptions([...options, ''])}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-medium"
                >
                  <Plus size={16} /> Agregar opción
                </button>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectConfigItem(null)}
                  className="px-6 py-3 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectConfigItem) {
                      const validOptions = options.filter(opt => opt.trim() !== '');
                      if (validOptions.length === 0) {
                        toast.error('Debes agregar al menos una opción');
                        return;
                      }
                      updateItemOptions(selectConfigItem.sectionId, selectConfigItem.itemId, options.filter(Boolean));
                      setSelectConfigItem(null);
                      toast.success('Opciones guardadas');
                    }
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* {selectConfigItem && (
          <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
                Opciones del select
              </h3>

              {options.map((opt, idx) => (
                <input
                  key={idx}
                  value={opt}
                  onChange={(e) =>
                    setOptions(prev =>
                      prev.map((o, i) => (i === idx ? e.target.value : o))
                    )
                  }
                  placeholder={`Opción ${idx + 1}`}
                  className="w-full border-b py-2 outline-none"
                />
              ))}

              <button
                type="button"
                onClick={() => setOptions([...options, ''])}
                className="text-xs text-rose-600 font-bold"
              >
                + Agregar opción
              </button>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setSelectConfigItem(null)}
                  className="flex-1 text-xs uppercase"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    updateItemOptions(
                      selectConfigItem.sectionId,
                      selectConfigItem.itemId,
                      options.filter(Boolean)
                    );
                    setSelectConfigItem(null);
                  }}
                  className="flex-1 bg-slate-900 text-white rounded-full text-xs py-2"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )} */}
      </main>

      {/* FOOTER ACCIONES FINAL */}
      <footer className="px-6 py-8 md:px-12 bg-white border-t border-slate-100 sticky bottom-0 z-50 flex justify-end">
        <button
          type="submit"
          className="group flex items-center disabled:opacity-40 disabled:cursor-not-allowed gap-4 bg-emerald-600 text-white px-10 py-4 rounded-full hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100"
          disabled={!isValid}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            {step === maxSteps ? 'Enviar datos' : 'Siguiente'}
          </span>
          {step < maxSteps && (
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          )}
        </button>

      </footer>

      {/* MODAL AJUSTADO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-slate-100">
            <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center italic">
              Nueva Sección
            </h3>
            <input
              autoFocus
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="NOMBRE DE SECCIÓN"
              className="w-full border-b border-slate-200 px-2 py-4 text-xl font-light outline-none focus:border-rose-500 transition-all mb-8"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSection}
                className="flex-1 bg-slate-900 text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default StepTwoFormato;