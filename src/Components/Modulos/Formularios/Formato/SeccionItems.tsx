import { useForm, useFieldArray } from "react-hook-form";
 import useSelectedFormatoStore from "../../../Store/FormatoStore/selectedFormatoStore";
import { useEffect } from "react";
import { PlusCircleIcon, PlusIcon, TrashIcon } from "lucide-react";

const SeccionItems = () => {
    const { formato, setFormato } = useSelectedFormatoStore();

    // Inicializamos el formulario con los valores del Store
    const { register, control, handleSubmit, reset } = useForm({
        defaultValues: formato
    });

    // Manejador de las Secciones (Checklist)
    const { fields: secciones, append: appendSeccion, remove: removeSeccion } = useFieldArray({
        control,
        name: "checklist"
    });

    // Sincronizar el formulario si el formato del store cambia
    useEffect(() => {
        reset(formato);
    }, [formato, reset]);

    const onSubmit = (data: any) => {
        console.log("Datos listos para Firebase:", data);
        setFormato(data); // Actualizamos el store global
        // Aquí llamarías a tu función: updateFormatoEnFirebase(data.id, data);
        alert("¡Cambios listos para guardar!");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 bg-white my-8 border border-gray-200 shadow-2xl rounded-lg">

            {/* --- BOTONES DE CABECERA --- */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-gray-700 uppercase tracking-tighter">Editar formato {formato.nombreFormato}</h2>
                <button
                    type="button"
                    onClick={() => appendSeccion({
                        id: crypto.randomUUID(),
                        nombre: "NUEVA SECCIÓN",
                        orden: secciones.length,
                        campos: [],
                        items: []
                    })}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-all text-xs font-bold"
                >
                    <PlusCircleIcon className="w-5 h-5" /> AÑADIR SECCIÓN
                </button>
            </div>

            {/* --- ENCABEZADO DISEÑO IMAGEN (Inputs Registrados) --- */}
            <div className="border-[1px] border-black w-full flex mb-10">
                <div className="w-1/3 border-r-[1px] border-black p-6 flex items-center justify-center">
                    <span className="text-xs font-black text-gray-300 tracking-[0.2em] rotate-[-5deg]">LOGO EMPRESA</span>
                </div>

                <div className="w-1/3 border-r-[1px] border-black p-2 flex flex-col justify-center">
                    <input
                        {...register("nombreFormato")}
                        className="w-full text-center font-bold uppercase text-sm outline-none focus:bg-yellow-50 p-2"
                    />
                </div>

                <div className="w-1/6 border-r-[1px] border-black flex flex-col text-[10px] font-bold">
                    <input {...register("version")} className="border-b-[1px] border-black p-2 text-center outline-none focus:bg-yellow-50" placeholder="VERSIÓN" />
                    <input {...register("fechaCreacion")} className="border-b-[1px] border-black p-2 text-center outline-none focus:bg-yellow-50" placeholder="CREACIÓN" />
                    <input {...register("fechaActualizacion")} className="border-b-[1px] border-black p-2 text-center outline-none focus:bg-yellow-50" placeholder="ACTUALIZACIÓN" />
                    <input {...register("fechaRevision")} className="p-2 text-center outline-none focus:bg-yellow-50" placeholder="REVISIÓN" />
                </div>

                <div className="w-1/6 flex flex-col p-2 justify-center items-center">
                    <span className="text-xs text-center outline-none focus:bg-yellow-50">SIG UBICACIÓN</span>
                    <input
                        {...register("numeralSIG")}
                        className="w-full text-center text-xs bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* --- RENDERIZADO DINÁMICO DE SECCIONES --- */}
            <div className="space-y-12">
                {secciones.map((seccion, indexSeccion) => (
                    <SeccionItem
                        key={seccion.id}
                        indexSeccion={indexSeccion}
                        control={control}
                        register={register}
                        removeSeccion={removeSeccion}
                    />
                ))}
            </div>

            {/* --- ACCIONES FINALES --- */}
            <div className="mt-4 flex justify-end gap-4">
                <button type="submit" className="px-4 py-2 border-2 border-black rounded-lg text-black font-black hover:text-blue-600 hover:border-blue-600 flex items-center gap-3 transition-all uppercase text-sm tracking-widest">
                    <TrashIcon className="w-6 h-6" />
                    enviar
                </button>
            </div>
        </form>
    );
};

// Sub-componente para manejar los items de cada sección con su propio useFieldArray
const SeccionItem = ({ indexSeccion, control, register, removeSeccion }: any) => {
    const { fields: items, append, remove } = useFieldArray({
        control,
        name: `checklist.${indexSeccion}.items`
    });

    return (
        <div className="border-1 border-black rounded-sm overflow-hidden shadow-md bg-white">
            <div className="text-black p-3 border-b-[1px] border-black flex justify-between items-center">
                <input
                    {...register(`checklist.${indexSeccion}.nombre`)}
                    className="bg-transparent font-bold uppercase text-xs border-none focus:ring-0 w-2/3 p-0"
                    placeholder="NOMBRE DE LA SECCIÓN"
                />
                <button type="button" onClick={() => removeSeccion(indexSeccion)}
                    className="hover:text-red-600 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-2">
                {items.map((item, indexItem) => (
                    <div key={item.id} className="flex border border-1 rounded-md border-black items-center gap-3 bg-white p-2 border-gray-300">
                        <span className="text-xs font-bold text-gray-400">{indexItem + 1}.</span>
                        <input
                            {...register(`checklist.${indexSeccion}.items.${indexItem}.nombre`)}
                            className="flex-1 text-sm border-none focus:ring-0 outline-none p-0"
                            placeholder="Descripción del ítem..."
                        />
                        <button
                            type="button"
                            onClick={() => remove(indexItem)}
                            className="hover:text-red-600 transition-all"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => append({ id: crypto.randomUUID(), nombre: "", cumple: false })}
                    className="mt-3 text-[11px] flex items-center gap-1 bg-white border border-black border-dashed px-3 py-1 font-black hover:bg-black hover:text-white transition-all uppercase"
                >
                    <PlusIcon className="w-3 h-3" /> Nueva sección
                </button>
            </div>
        </div>
    );
};

export default SeccionItems;