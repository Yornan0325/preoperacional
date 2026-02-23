import React, { useState, useRef, useEffect } from "react";
import IconLucide from "../../Icon/IconLucide";
import type { Equipo } from "../../typesScript/equipoFormType";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useFormatoGetDataStore } from "../../Store/FormatoStore/formatoGetDataStore";

interface VisualizadorReporteProps {
    onClose: () => void;
    equipo: Equipo;
    registros: any[];
}

const VisualizadorReporte: React.FC<VisualizadorReporteProps> = ({ onClose, equipo, registros }) => {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const { formatoData, cargarFormatos } = useFormatoGetDataStore();

    useEffect(() => {
        if (formatoData.length === 0) {
            cargarFormatos();
        }
    }, [formatoData, cargarFormatos]);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPDF(true);
        const toastId = toast.loading("Generando PDF consolidado...");

        try {
            const element = reportRef.current;

            // 1. CAPTURAR EL ELEMENTO CON HTML2CANVAS (Lógica sugerida para capturar todo el contenido)
            const canvas = await html2canvas(element, {
                scale: 2, // Mayor calidad para que no se vea pixeleado
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 1024,
                onclone: (clonedDoc: Document) => {
                    // 1. RE-APLICAMOS LIMPIEZA AGRESIVA (Indispensable para Tailwind 4)
                    // Solo limpiamos los colores que rompen la librería, sin afectar el diseño
                    const sanitize = (css: string) => {
                        return css
                            .replace(/oklch\([^)]*\)/g, '#475569')
                            .replace(/oklab\([^)]*\)/g, '#475569')
                            .replace(/color-mix\([^)]*\)/g, '#475569');
                    };

                    // Sanear etiquetas <style>
                    const styles = clonedDoc.getElementsByTagName('style');
                    for (let i = 0; i < styles.length; i++) {
                        styles[i].innerHTML = sanitize(styles[i].innerHTML);
                    }

                    // Sanear estilos inline
                    const allElements = clonedDoc.getElementsByTagName('*');
                    for (let i = 0; i < allElements.length; i++) {
                        const el = allElements[i] as HTMLElement;
                        if (el.style && el.style.cssText) {
                            el.style.cssText = sanitize(el.style.cssText);
                        }
                    }

                    // 2. MANTENER FONDOS (HTML2Canvas a veces ignora fondos si no son !important)
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        .bg-slate-900 { background-color: #0f172a !important; }
                        .bg-blue-600 { background-color: #2563eb !important; }
                        .bg-emerald-50 { background-color: #ecfdf5 !important; }
                        .bg-rose-50 { background-color: #fff1f2 !important; }
                        .bg-slate-50 { background-color: #f8fafc !important; }
                    `;
                    clonedDoc.body.appendChild(style);
                }
            });

            // 2. CONFIGURACIÓN DEL PDF (Como solicitaste: mm y compress)
            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF({
                compress: true,
                format: "a4",
                orientation: "portrait",
                unit: "mm"
            });


            // Dimensiones de una hoja A4 en mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            // Calculamos la altura proporcional de la imagen capturada para el ancho A4
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            // 3. AÑADIR AL PDF (Soporte multipágina mediante "slicing" de la imagen larga)
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            // 4. METADATOS Y GUARDADO
            pdf.setProperties({
                title: `Reporte Consolidado ${equipo.placa}`,
                subject: 'Inspección de Equipos',
                author: 'Sistema Preoperacional'
            });

            pdf.save(`Reporte_Consolidado_${equipo.placa}_${new Date().getTime()}.pdf`);
            toast.success("Descarga completada", { id: toastId });

        } catch (error) {
            console.error("Error PDF:", error);
            toast.error("Error al generar el PDF", { id: toastId });
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (!registros || registros.length === 0) {
        return (
            <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-3xl text-center">
                    <IconLucide name="alertCircle" size={48} strokeWidth={1} className="text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-black uppercase">No hay reportes seleccionados</h3>
                    <button onClick={onClose} className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Cerrar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[120] bg-slate-450/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-6 overflow-hidden">
            <div className="bg-white w-full h-full md:max-w-6xl md:h-[95vh] md:rounded-[2rem] flex flex-col animate-in zoom-in-95 duration-500 overflow-hidden">

                {/* CABECERA PREMIUM */}
                <div className="px-8 py-6 bg-slate-900 text-white flex shrink-0 items-center justify-between z-20">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg shadow-blue-500/20">
                            <IconLucide name="clipboardCheck" size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Reporte Consolidado</h2>
                                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-blue-500/20">
                                    {registros.length} Registros
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase mt-1">
                                <span className="text-white bg-blue-600 px-2 py-0.5 rounded-md">{equipo.placa}</span>
                                <span className="text-slate-200">{equipo.nombreEquipo}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={isGeneratingPDF}
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <IconLucide name={isGeneratingPDF ? "cloudBackup" : "download"} size={16} strokeWidth={2.5} className={isGeneratingPDF ? "animate-bounce" : ""} />
                            {isGeneratingPDF ? "Generando..." : "Bajar PDF"}
                        </button>
                        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                            <IconLucide name="x" size={24} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden bg-white">
                    {/* CONTENIDO DEL REPORTE (ZONA DE CAPTURA) */}
                    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8">
                        <div ref={reportRef} className="bg-white w-full max-w-4xl mx-auto space-y-16 pb-20">

                            {registros.map((registroActual) => {
                                const secciones = registroActual.respuestas?.reduce((acc: any, item: any) => {
                                    const sec = item.seccion || "General";
                                    if (!acc[sec]) acc[sec] = [];
                                    acc[sec].push(item);
                                    return acc;
                                }, {});

                                // Buscar metadata del formato
                                const formatId = registroActual.formatoId || equipo.relacionFormato;
                                const metaFormato = formatoData.find(f => f.id === formatId) as any;

                                return (
                                    <div key={registroActual.id} className="p-8 md:p-12 border-b-2 border-slate-100 last:border-0 print:break-after-page">
                                        {/* CABECERA TIPO TABLA FORMAL */}
                                        <div className="border-2 border-slate-900 mb-8 overflow-hidden rounded-t-xl">
                                            <div className="grid grid-cols-4 border-b-2 border-slate-900">
                                                <div className="col-span-1 p-4 flex items-center justify-center border-r-2 border-slate-900">
                                                    <div className="font-black text-xl italic tracking-tighter">PRE-OP</div>
                                                </div>
                                                <div className="col-span-2 p-4 flex flex-col items-center justify-center border-r-2 border-slate-900 text-center">
                                                    <h1 className="text-sm font-black uppercase">{metaFormato?.nombreFormato || "Formato de Inspección Diaria de Equipos"}</h1>
                                                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                                                        {"FORMATO DE INSPECCIÓN"}
                                                    </p>
                                                </div>
                                                <div className="col-span-1 p-2 flex flex-col text-[7px] font-black uppercase">
                                                    <div className="flex justify-between border-b border-slate-200 py-0.5"><span>Código:</span> <span>{metaFormato?.codigoSIG || "FOR-SST-042"}</span></div>
                                                    <div className="flex justify-between border-b border-slate-200 py-0.5"><span>Numeral SIG:</span> <span>{metaFormato?.numeralSIG || "-"}</span></div>
                                                    <div className="flex justify-between border-b border-slate-200 py-0.5"><span>Versión:</span> <span>{metaFormato?.version || "03"}</span></div>
                                                    <div className="flex justify-between border-b border-slate-200 py-0.5"><span>F. Creación:</span> <span>{metaFormato?.fechaCreacion ? new Date(metaFormato.fechaCreacion).toLocaleDateString() : "-"}</span></div>
                                                    <div className="flex justify-between pb-0.5"><span>F. Act:</span> <span>{metaFormato?.fechaActualizacion ? new Date(metaFormato.fechaActualizacion).toLocaleDateString() : "-"}</span></div>
                                                </div>
                                            </div>

                                            {/* DATOS TÉCNICOS TABULADOS */}
                                            <div className="grid grid-cols-3 bg-white">
                                                <div className="p-3 border-r-2 border-slate-900 border-b-2">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Equipo</label>
                                                    <p className="text-[11px] font-black uppercase text-slate-800">{equipo.nombreEquipo}</p>
                                                </div>
                                                <div className="p-3 border-r-2 border-slate-900 border-b-2">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Placa / Serial</label>
                                                    <p className="text-[11px] font-black uppercase text-slate-800">{equipo.placa} / {equipo.serial || "N/A"}</p>
                                                </div>
                                                <div className="p-3 border-b-2 border-slate-900">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Fecha de Inspección</label>
                                                    <p className="text-[11px] font-black uppercase text-slate-800">{new Date(registroActual.fechaInspeccion + "T00:00:00").toLocaleDateString("es-CO", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                                <div className="p-3 border-r-2 border-slate-900">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Se realizó</label>
                                                    <p className="text-[9px] font-bold uppercase text-slate-800">
                                                        {registroActual.creadoEn ? new Date(registroActual.creadoEn + "T00:00:00").toLocaleDateString("es-CO", { day: '2-digit', month: 'long', year: 'numeric' }) : "Sin fecha registro"}
                                                    </p>
                                                </div>
                                                <div className="p-3 border-r-2 border-slate-900">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Ubicación</label>
                                                    <p className="text-[11px] font-black uppercase text-slate-800 leading-tight">{equipo.proyecto} - {equipo.ubicacion}</p>
                                                </div>
                                                <div className="p-3 flex items-center justify-center text-center">
                                                    <div>
                                                        <p className="text-[8px] font-bold uppercase opacity-60">Estado</p>
                                                        <p className="text-[12px] font-black uppercase tracking-widest">{registroActual.estado}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TABLA DE CHECKLIST REDISEÑADA: VALOR EN FRENTE */}
                                        <div className="border-2 border-slate-900 overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                                                        <th className="p-3 border-r border-white/20 w-[60%]">Ítem de Inspección</th>
                                                        <th className="p-3 w-32 text-center border-r border-white/20">Estado</th>
                                                        <th className="p-3">Observaciones / Hallazgos</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-[10px]">
                                                    {secciones && Object.entries(secciones).map(([nombreSec, items]: [string, any]) => (
                                                        <React.Fragment key={nombreSec}>
                                                            <tr>
                                                                <td colSpan={3} className="p-2 font-black uppercase tracking-widest text-[8px] text-slate-400 italic bg-white">{nombreSec}</td>
                                                            </tr>
                                                            {items.map((item: any) => (
                                                                <tr key={item.id}>
                                                                    <td className="p-3 font-bold text-slate-700 uppercase">{item.nombre}</td>
                                                                    <td className="p-3 text-center">
                                                                        <span className="px-4 py-1.5 font-black text-slate-700 text-[9px]">
                                                                            {item.valor === 'B' ? 'BIEN' : item.valor === 'M' ? 'MAL' : item.valor}
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3 text-[9px] font-medium text-slate-500 italic leading-tight">{item.observacion || "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* SECCIÓN DE FIRMAS REDUCIDA EN ALTO */}
                                        <div className="grid grid-cols-3 gap-0 border-2">
                                            <div className="flex flex-col">
                                                <div className="p-1.5 bg-slate-900 text-white text-[8px] font-black uppercase text-center tracking-widest">Operador</div>
                                                <div className="h-20 flex items-center justify-center p-3 relative">
                                                    {registroActual.firmas?.operador?.firmaImg && <img src={registroActual.firmas.operador.firmaImg} className="h-full object-contain mix-blend-multiply" />}
                                                </div>
                                                <div className="p-1.5 border-t border-slate-100 bg-slate-50 text-[8px] font-bold text-slate-500 text-center uppercase truncate">
                                                    {equipo.asignadoOperador?.nombre}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="p-1.5 bg-slate-900 text-white text-[8px] font-black uppercase text-center tracking-widest">SISO</div>
                                                <div className="h-20 flex items-center justify-center p-3">
                                                    {registroActual.firmas?.siso?.firmado ? <img src={registroActual.firmas.siso.firmaImg} className="h-full object-contain mix-blend-multiply" /> : <div className="text-[8px] text-slate-200 uppercase font-bold italic opacity-30">Sello Pendiente</div>}
                                                </div>
                                                <div className="p-1.5 border-t border-slate-100 bg-slate-50 text-[8px] font-bold text-slate-500 text-center uppercase">Coord. SST</div>
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="p-1.5 bg-slate-900 text-white text-[8px] font-black uppercase text-center tracking-widest">COPASST</div>
                                                <div className="h-20 flex items-center justify-center p-3">
                                                    {registroActual.firmas?.copas?.firmado ? <img src={registroActual.firmas.copas.firmaImg} className="h-full object-contain mix-blend-multiply" /> : <div className="text-[8px] text-slate-200 uppercase font-bold italic opacity-30">Sello Pendiente</div>}
                                                </div>
                                                <div className="p-1.5 border-t border-slate-100 bg-slate-50 text-[8px] font-bold text-slate-500 text-center uppercase">Delegado</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VisualizadorReporte;
