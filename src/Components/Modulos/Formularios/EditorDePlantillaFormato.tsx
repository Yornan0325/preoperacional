// import { useForm, useFieldArray, useWatch } from "react-hook-form";
// import { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { PlusCircleIcon, PlusIcon, TrashIcon, SaveIcon, ArrowLeftIcon, Settings2, ListTree } from "lucide-react";
// import useSelectedFormatoStore from "../../Store/FormatoStore/selectedFormatoStore";
// import { useFormatoGetDataStore } from "../../Store/FormatoStore/formatoGetDataStore";
// import type { FormatoCompleto } from "../../typesScript/preoperacionalType";
// import toast from "react-hot-toast";

// const EditorDePlantillaFormato = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { formato, setFormato } = useSelectedFormatoStore();
//     const { formatoData } = useFormatoGetDataStore();
//     const { guardarFormato } = useFormatoGetDataStore()
//     const { register, control, handleSubmit, reset } = useForm({
//         defaultValues: formato
//     });

//     const { fields: secciones, append: appendSeccion, remove: removeSeccion } = useFieldArray({
//         control,
//         name: "checklist"
//     });

//     // Cargar datos si estamos editando uno existente
//     useEffect(() => {
//         if (id && id !== "nuevo") {
//             const formatoAEditar = formatoData.find((f: { id: string; }) => f.id === id);
//             if (formatoAEditar) {
//                 reset(formatoAEditar);
//                 setFormato(formatoAEditar);
//             }
//         } else {
//             // Estructura inicial para un formato nuevo
//             const nuevoFormato: FormatoCompleto = {
//                 id: crypto.randomUUID(),
//                 nombreFormato: "NUEVO FORMATO",
//                 version: "01",
//                 numeralSIG: "SIG-FR-XXX",
//                 checklist: [],
//                 estado: 'ACTIVO',
//                 fechaCreacion: new Date().toISOString().split('T')[0],
//                 fechaActualizacion: new Date().toISOString().split('T')[0],
//                 fechaRevision: "",
//                 observaciones: ""
//             };
//             reset(nuevoFormato);
//             setFormato(nuevoFormato);
//         }
//     }, [id, formatoData, reset, setFormato]);


//     const onSubmit = async (data: any) => {

//         const loadingToast = toast.loading("Sincronizando plantilla...");
//         try {
//             // IMPORTANTE: Añadir await para esperar la respuesta de Firebase/Store
//             console.log("data.id", data)
//             guardarFormato(data);

//             toast.success("Cambios aplicados correctamente", { id: loadingToast });

//             // Solo navegamos si la promesa fue exitosa
//             navigate("/formulario");
//         } catch (error) {
//             toast.error("Error al procesar la solicitud en la base de datos", { id: loadingToast });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-4 md:p-8 bg-white shadow-2xl rounded-xl border border-slate-200 my-4">

//             {/* BARRA DE ACCIONES SUPERIOR */}
//             <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
//                 <button
//                     type="button"
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-bold text-xs uppercase"
//                 >
//                     <ArrowLeftIcon size={16} /> Volver
//                 </button>
//                 <div className="flex gap-3">
//                     <button
//                         type="button"
//                         onClick={() => appendSeccion({
//                             id: crypto.randomUUID(),
//                             nombre: "NUEVA SECCIÓN",
//                             orden: secciones.length,
//                             items: [],
//                             campos: []
//                         })}
//                         className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all text-xs font-black uppercase"
//                     >
//                         <PlusCircleIcon size={16} /> Añadir Sección
//                     </button>
//                     <button
//                         type="submit"
//                         className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all text-xs font-black uppercase"
//                     >
//                         <SaveIcon size={16} /> Guardar Plantilla
//                     </button>
//                 </div>
//             </div>

//             {/* ENCABEZADO TÉCNICO (IDÉNTICO A TU DISEÑO) */}
//             <div className="w-full mb-12 bg-white border-2 border-black rounded-md overflow-hidden shadow-sm flex">

//                 {/* LOGO */}
//                 <div className="w-1/4 border-r-2 border-black bg-slate-50 flex items-center justify-center p-8">
//                     <span className="text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase">
//                         Logo Empresa
//                     </span>
//                 </div>

//                 {/* TÍTULO */}
//                 <div className="w-2/4 border-r-2 border-black flex flex-col justify-center px-6 py-4">
//                     {/* <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-2">
//                         Título del Formato
//                     </label> */}

//                     <textarea
//                         {...register("nombreFormato")}
//                         rows={2}
//                         className="w-full text-center font-black uppercase text-lg tracking-wide outline-none focus:bg-yellow-50 resize-none"
//                         placeholder="NOMBRE DEL FORMATO"
//                     />
//                 </div>

//                 {/* DATOS TÉCNICOS */}
//                 <div className="w-1/4 flex">

//                     {/* BLOQUE VERSIONES */}
//                     <div className="w-1/2 border-r-2 border-black px-4 py-3 flex flex-col gap-3 text-xs">

//                         <div>
//                             <label className="block text-[9px] text-center font-bold text-slate-500 uppercase tracking-wider">
//                                 Versión
//                             </label>
//                             <input
//                                 {...register("version")}
//                                 className="w-full border-b-2 border-black text-center font-bold outline-none focus:bg-yellow-50"
//                                 placeholder="01"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-[9px] text-center font-bold text-slate-500 uppercase tracking-wider">
//                                 Fecha Creación
//                             </label>
//                             <input
//                                 {...register("fechaCreacion")}
//                                 className="w-full border-b-2 border-black text-center font-bold outline-none focus:bg-yellow-50"
//                                 placeholder="DD/MM/AAAA"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-[9px] text-center font-bold text-slate-500 uppercase tracking-wider">
//                                 Actualización
//                             </label>
//                             <input
//                                 {...register("fechaActualizacion")}
//                                 className="w-full border-b-2 border-black text-center font-bold outline-none focus:bg-yellow-50"
//                                 placeholder="DD/MM/AAAA"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-[9px] font-bold text-center text-slate-500 uppercase tracking-wider">
//                                 Revisión
//                             </label>
//                             <input
//                                 {...register("fechaRevision")}
//                                 className="w-full border-b-2 border-black text-center font-bold outline-none focus:bg-yellow-50"
//                                 placeholder="DD/MM/AAAA"
//                             />
//                         </div>

//                     </div>

//                     {/* SIG */}
//                     <div className="w-1/2 bg-slate-50 px-4 py-4 flex flex-col justify-center">
//                         <label className="text-[9px] font-bold text-center text-slate-500 uppercase tracking-wider mb-2 text-center">
//                             Código SIG
//                         </label>

//                         <input
//                             {...register("numeralSIG")}
//                             className="w-full text-center text-sm font-black bg-transparent outline-none border-b-2 border-dashed border-black focus:bg-yellow-50"
//                             placeholder="SIG-001"
//                         />
//                     </div>

//                 </div>
//             </div>

//             {/* RENDERIZADO DE SECCIONES */}
//             <div className="space-y-10">
//                 {secciones.map((seccion, indexSeccion) => (
//                     <SeccionItemEditor
//                         key={seccion.id}
//                         indexSeccion={indexSeccion}
//                         control={control}
//                         register={register}
//                         removeSeccion={removeSeccion}
//                     />
//                 ))}
//             </div>
//         </form>
//     );
// };

// const SeccionItemEditor = ({ indexSeccion, control, register, removeSeccion }: any) => {
//     const { fields: items, append, remove } = useFieldArray({
//         control,
//         name: `checklist.${indexSeccion}.items`
//     });

//     return (
//         <div className="border-[1.5px] border-black rounded-sm overflow-hidden bg-white shadow-sm mb-6">
//             {/* Título de Sección */}
//             <div className="bg-slate-900 text-white p-3 border-b-[1.5px] border-black flex justify-between items-center">
//                 <div className="flex items-center gap-3 w-2/3">
//                     <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-black">{indexSeccion + 1}</span>
//                     <input
//                         {...register(`checklist.${indexSeccion}.nombre`)}
//                         className="bg-transparent font-black uppercase text-xs border-none focus:ring-0 w-full p-0"
//                         placeholder="NOMBRE DE LA SECCIÓN (EJ: MOTOR)"
//                     />
//                 </div>
//                 <button type="button" onClick={() => removeSeccion(indexSeccion)} className="hover:text-red-500 transition-colors">
//                     <TrashIcon size={18} />
//                 </button>
//             </div>

//             {/* Lista de Ítems */}
//             <div className="p-4 bg-slate-50 space-y-4">
//                 {items.map((item, indexItem) => (
//                     <ItemDetalleEditor
//                         key={item.id}
//                         indexSeccion={indexSeccion}
//                         indexItem={indexItem}
//                         register={register}
//                         control={control}
//                         remove={remove}
//                     />
//                 ))}

//                 <button
//                     type="button"
//                     onClick={() => append({
//                         id: crypto.randomUUID(),
//                         nombre: "",
//                         tipo: 'checkbox', // Valor por defecto
//                         opciones: []   // Para cuando sea select
//                     })}
//                     className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline"
//                 >
//                     <PlusIcon size={14} /> Añadir Ítem de Inspección
//                 </button>
//             </div>
//         </div>
//     );
// };

// // --- SUB-COMPONENTE PARA CADA ÍTEM (MANEJA LA LÓGICA DEL TIPO) ---
// const ItemDetalleEditor = ({ indexSeccion, indexItem, register, control, remove }: any) => {
//     // Observamos el valor del "tipo" para este ítem específico
//     const tipoSeleccionado = useWatch({
//         control,
//         name: `checklist.${indexSeccion}.items.${indexItem}.tipo`
//     });

//     // FieldArray para las opciones del SELECT
//     const { fields: opciones, append: appendOpcion, remove: removeOpcion } = useFieldArray({
//         control,
//         name: `checklist.${indexSeccion}.items.${indexItem}.opciones`
//     });

//     return (
//         <div className="bg-white border-[1.5px] border-black rounded-md p-3 shadow-sm group">
//             <div className="flex flex-wrap items-center gap-4">
//                 <span className="text-[10px] font-black text-slate-400">{indexItem + 1}</span>

//                 {/* Nombre del Ítem */}
//                 <input
//                     {...register(`checklist.${indexSeccion}.items.${indexItem}.nombre`)}
//                     className="flex-1 min-w-[200px] text-sm font-bold border-none focus:ring-0 outline-none p-0"
//                     placeholder="Punto de inspección (EJ: Nivel de Aceite)..."
//                 />

//                 {/* Selector de Tipo de Dato */}
//                 <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded">
//                     <Settings2 size={12} className="text-slate-500" />
//                     <select
//                         {...register(`checklist.${indexSeccion}.items.${indexItem}.tipo`)}
//                         className="bg-transparent text-[10px] font-black uppercase border-none focus:ring-0 cursor-pointer"
//                     >
//                         <option value="checkbox">✓ Check</option>
//                         <option value="text">✎ Texto</option>
//                         <option value="number"># Numero</option>
//                         <option value="select">☰ Lista</option>
//                     </select>
//                 </div>

//                 <button type="button" onClick={() => remove(indexItem)} className="text-slate-300 hover:text-red-600">
//                     <TrashIcon size={16} />
//                 </button>
//             </div>

//             {/* --- LÓGICA DINÁMICA PARA SELECT --- */}
//             {tipoSeleccionado === 'select' && (
//                 <div className="mt-4 ml-8 p-3 border-l-2 border-blue-500 bg-blue-50/30 rounded-r-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <ListTree size={14} className="text-blue-600" />
//                         <span className="text-[10px] font-black uppercase text-blue-600">Configurar Opciones de la Lista</span>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                         {opciones.map((opcion, indexOpcion) => (
//                             <div key={opcion.id} className="flex gap-1">
//                                 <input
//                                     {...register(`checklist.${indexSeccion}.items.${indexItem}.opciones.${indexOpcion}.label`)}
//                                     className="flex-1 text-[11px] p-1 border border-slate-300 rounded focus:border-blue-500 outline-none uppercase font-bold"
//                                     placeholder="Opción (EJ: Bueno)"
//                                 />
//                                 <button type="button" onClick={() => removeOpcion(indexOpcion)} className="text-red-400 hover:text-red-600">
//                                     <TrashIcon size={14} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => appendOpcion({ label: "" })}
//                         className="mt-2 text-[9px] font-black text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors uppercase"
//                     >
//                         + Añadir Opción
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EditorDePlantillaFormato;

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { PlusCircleIcon, SaveIcon, ArrowLeftIcon, TrashIcon, PlusIcon, Settings2, ListTree } from "lucide-react";
import toast from "react-hot-toast";

// Stores y Types
import useSelectedFormatoStore from "../../Store/FormatoStore/selectedFormatoStore";
import { useFormatoGetDataStore } from "../../Store/FormatoStore/formatoGetDataStore";
import type { FormatoCompleto } from "../../typesScript/preoperacionalType";

// NUEVOS COMPONENTES REFACTORIZADOS
import { EditorHeader } from "./EditorHeader";

const EditorDePlantillaFormato = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formato, setFormato } = useSelectedFormatoStore();
    const { formatoData, guardarFormato } = useFormatoGetDataStore();

    const { register, control, handleSubmit, reset } = useForm<FormatoCompleto>({
        defaultValues: formato
    });

    const { fields: secciones, append: appendSeccion, remove: removeSeccion } = useFieldArray({
        control,
        name: "checklist"
    });
    useEffect(() => {
        if (id && id !== "nuevo") {
            const formatoAEditar = formatoData.find((f: { id: string; }) => f.id === id);
            if (formatoAEditar) {
                reset(formatoAEditar);
                setFormato(formatoAEditar);
            }
        } else {
            // Estructura inicial para un formato nuevo
            const nuevoFormato: FormatoCompleto = {
                id: crypto.randomUUID(),
                nombreFormato: "NUEVO FORMATO",
                version: "01",
                numeralSIG: "SIG-FR-XXX",
                checklist: [],
                estado: 'ACTIVO',
                fechaCreacion: new Date().toISOString().split('T')[0],
                fechaActualizacion: new Date().toISOString().split('T')[0],
                fechaRevision: "",
                observaciones: ""
            };
            reset(nuevoFormato);
            setFormato(nuevoFormato);
        }
    }, [id, formatoData, reset, setFormato]);


    const onSubmit = async (data: FormatoCompleto) => {
        const loadingToast = toast.loading("Sincronizando plantilla...");
        try {
            await guardarFormato(data);
            toast.success("Cambios aplicados correctamente", { id: loadingToast });
            navigate("/formulario");
        } catch (error) {
            toast.error("Error al guardar", { id: loadingToast });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-4 md:p-8 bg-white shadow-2xl rounded-xl border border-slate-200 my-4">

            {/* BARRA DE ACCIONES */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-black font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeftIcon size={16} /> Volver
                </button>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => appendSeccion({
                            id: crypto.randomUUID(),
                            nombre: "NUEVA SECCIÓN",
                            orden: secciones.length, // Se calcula según el total actual
                            items: [],
                            campos: [] // O 'camposts' según defina tu interfaz
                        })}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                        <PlusCircleIcon size={16} /> Añadir Sección
                    </button>
                    <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        <SaveIcon size={16} /> Guardar Plantilla
                    </button>
                </div>
            </div>

            {/* COMPONENTE: ENCABEZADO TÉCNICO */}
            <EditorHeader register={register} />

            {/* LISTADO DE SECCIONES */}
            <div className="space-y-10">
                {secciones.map((seccion, index) => (
                    <SeccionItemEditor
                        key={seccion.id}
                        indexSeccion={index}
                        control={control}
                        register={register}
                        removeSeccion={removeSeccion}
                    />
                ))}
            </div>
        </form>
    );
};
const SeccionItemEditor = ({ indexSeccion, control, register, removeSeccion }: any) => {
    const { fields: items, append, remove } = useFieldArray({
        control,
        name: `checklist.${indexSeccion}.items`
    });

    return (
        <div className="border-[1.5px] border-black rounded-sm overflow-hidden bg-white shadow-sm mb-6">
            {/* Título de Sección */}
            <div className="bg-slate-900 text-white p-3 border-b-[1.5px] border-black flex justify-between items-center">
                <div className="flex items-center gap-3 w-2/3">
                    <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-black">{indexSeccion + 1}</span>
                    <input
                        {...register(`checklist.${indexSeccion}.nombre`)}
                        className="bg-transparent font-black uppercase text-xs border-none focus:ring-0 w-full p-0"
                        placeholder="NOMBRE DE LA SECCIÓN (EJ: MOTOR)"
                    />
                </div>
                <button type="button" onClick={() => removeSeccion(indexSeccion)} className="hover:text-red-500 transition-colors">
                    <TrashIcon size={18} />
                </button>
            </div>

            {/* Lista de Ítems */}
            <div className="p-4 bg-slate-50 space-y-4">
                {items.map((item, indexItem) => (
                    <ItemDetalleEditor
                        key={item.id}
                        indexSeccion={indexSeccion}
                        indexItem={indexItem}
                        register={register}
                        control={control}
                        remove={remove}
                    />
                ))}

                <button
                    type="button"
                    onClick={() => append({
                        id: crypto.randomUUID(),
                        nombre: "",
                        tipo: 'checkbox', // Valor por defecto
                        opciones: []   // Para cuando sea select
                    })}
                    className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 hover:underline"
                >
                    <PlusIcon size={14} /> Añadir Ítem de Inspección
                </button>
            </div>
        </div>
    );
};

const ItemDetalleEditor = ({ indexSeccion, indexItem, register, control, remove }: any) => {
    // Observamos el valor del "tipo" para este ítem específico
    const tipoSeleccionado = useWatch({
        control,
        name: `checklist.${indexSeccion}.items.${indexItem}.tipo`
    });

    // FieldArray para las opciones del SELECT
    const { fields: opciones, append: appendOpcion, remove: removeOpcion } = useFieldArray({
        control,
        name: `checklist.${indexSeccion}.items.${indexItem}.opciones`
    });

    return (
        <div className="bg-white border-[1.5px] border-black rounded-md p-3 shadow-sm group">
            <div className="flex flex-wrap items-center gap-4">
                <span className="text-[10px] font-black text-slate-400">{indexItem + 1}</span>

                {/* Nombre del Ítem */}
                <input
                    {...register(`checklist.${indexSeccion}.items.${indexItem}.nombre`)}
                    className="flex-1 min-w-[200px] text-sm font-bold border-none focus:ring-0 outline-none p-0"
                    placeholder="Punto de inspección (EJ: Nivel de Aceite)..."
                />

                {/* Selector de Tipo de Dato */}
                <div className="flex items-center gap-2 bg-slate-100 px-2 py-1 rounded">
                    <Settings2 size={12} className="text-slate-500" />
                    <select
                        {...register(`checklist.${indexSeccion}.items.${indexItem}.tipo`)}
                        className="bg-transparent text-[10px] font-black uppercase border-none focus:ring-0 cursor-pointer"
                    >
                        <option value="checkbox">✓ Check</option>
                        <option value="text">✎ Texto</option>
                        <option value="number"># Numero</option>
                        <option value="select">☰ Lista</option>
                    </select>
                </div>

                <button type="button" onClick={() => remove(indexItem)} className="text-slate-300 hover:text-red-600">
                    <TrashIcon size={16} />
                </button>
            </div>

            {/* --- LÓGICA DINÁMICA PARA SELECT --- */}
            {tipoSeleccionado === 'select' && (
                <div className="mt-4 ml-8 p-3 border-l-2 border-blue-500 bg-blue-50/30 rounded-r-md">
                    <div className="flex items-center gap-2 mb-2">
                        <ListTree size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase text-blue-600">Configurar Opciones de la Lista</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {opciones.map((opcion, indexOpcion) => (
                            <div key={opcion.id} className="flex gap-1">
                                <input
                                    {...register(`checklist.${indexSeccion}.items.${indexItem}.opciones.${indexOpcion}.label`)}
                                    className="flex-1 text-[11px] p-1 border border-slate-300 rounded focus:border-blue-500 outline-none uppercase font-bold"
                                    placeholder="Opción (EJ: Bueno)"
                                />
                                <button type="button" onClick={() => removeOpcion(indexOpcion)} className="text-red-400 hover:text-red-600">
                                    <TrashIcon size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => appendOpcion({ label: "" })}
                        className="mt-2 text-[9px] font-black text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors uppercase"
                    >
                        + Añadir Opción
                    </button>
                </div>
            )}
        </div>
    );
};
export default EditorDePlantillaFormato;