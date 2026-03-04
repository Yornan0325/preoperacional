import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where, increment } from 'firebase/firestore';
import { db } from '../firebase';
// import type { Equipo } from '../../typesScript/equipoFormType';
import type { FormatoCompleto, InspeccionGuardar } from '../../typesScript/preoperacionalType';


// Definimos y exportamos la interfaz para que el Store pueda usarla
// export interface EquipoPayload {
//     nombreEquipo: string;
//     placa: string;
//     marca: string;
//     serial: string;
//     relacionFormato: string; // Aquí llegará "VEHICULO_LIVIANO"
//     estado: string;
//     proyecto: string;
//     ubicacion: string;
//     asignadoOperador: {
//         nombre: string;
//         cargo: string;
//     };
//     imagen?: string;
// }
 
export const createEquipo = async (data: any) => {
    try {
        const placaUpper = data.placa.toUpperCase().trim();

        // 🔎 1. Validar que no exista otra placa igual
        const q = query(
            collection(db, "equipos"),
            where("placa", "==", placaUpper)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Ya existe un equipo con esa placa.");
        }

        // 🆔 2. Crear documento con ID automático
        const equipoRef = doc(collection(db, "equipos"));

        const payload = {
            ...data,
            id: equipoRef.id,
            relacionFormato: data.relacionFormato,
            nombreEquipo: data.nombreEquipo,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(equipoRef, payload);

        return equipoRef.id;

    } catch (error) {
        console.error("Error al crear equipo:", error);
        throw error;
    }
};

const crearIdLegible = (nombre: string): string => {
    return nombre
        .trim()
        .normalize("NFD") // Separa las tildes de las letras (ej: 'Ú' se vuelve 'U' + '´')
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos/tildes
        .toUpperCase()
        .replace(/\s+/g, '_') // Espacios por guiones bajos
        .replace(/[^A-Z0-9_]/g, ''); // Elimina cualquier otro símbolo raro que quede
};

export const uploadFormatoToFirebase = async (data: FormatoCompleto) => {
    // 1. Decidimos el ID: Si ya tiene uno (edición) lo usamos, 
    // sino, creamos uno limpio basado en el nombre del formato.
    // const idDocumento = data.id && data.id.length > 10 // Si es un UUID o ID de Firebase
    //     ? data.id 
    //     : crearIdLegible(data.nombreFormato);
    const idDocumento = crearIdLegible(data.nombreFormato);
    const formatoRef = doc(db, "plantillas_formatos", idDocumento);

    const payload = {
        ...data,
        id: idDocumento, // Ahora el ID es el nombre limpio
        nombreFormato: data.nombreFormato.toUpperCase(),
        updatedAt: serverTimestamp(),
    };

    console.log("data.nombreFormato", data.nombreFormato)
    console.log("📤 Enviando a Firebase con ID:", idDocumento);

    try {
        await setDoc(formatoRef, payload, { merge: true });
        return payload;
    } catch (error) {
        console.error("Error en setDoc:", error);
        throw error;
    }
};


export const updateEquipoInFirebase = async (id: string, data: Partial<any>) => {
    // Usamos el ID del equipo para encontrar el documento en la colección 'equipos'
    const equipoRef = doc(db, "equipos", id);
    return await updateDoc(equipoRef, data);
};

export const guardarDatosVisualizacion = async (equipoId: string, datos: any) => {
    try {
        const equipoRef = doc(db, "equipos", equipoId);
        const visualizarRef = doc(equipoRef, "visualizar", "datos");
        
        const payload = {
            vencimientoExtintor: datos.vencimientoExtintor || null,
            vencimientoSOAT: datos.vencimientoSOAT || null,
            vencimientoTecnoMecanica: datos.vencimientoTecnoMecanica || null,
            otros: datos.otros || {},
            updatedAt: serverTimestamp(),
        };
        
        await setDoc(visualizarRef, payload, { merge: true });
        return true;
    } catch (error) {
        console.error("Error al guardar datos de visualización:", error);
        throw error;
    }
};

export const cargarDatosVisualizacion = async (equipoId: string) => {
    try {
        const equipoRef = doc(db, "equipos", equipoId);
        const visualizarRef = doc(equipoRef, "visualizar", "datos");
        
        const docSnap = await getDoc(visualizarRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error al cargar datos de visualización:", error);
        throw error;
    }
};

export const saveInspeccionDiaria = async (payload: InspeccionGuardar) => {
    try {
        const id = `${payload.equipoId}_${payload.fechaInspeccion}`;
        const ref = doc(db, "InspeccionesDiarias", id);
        await setDoc(ref, payload, { merge: true });
        return id;
    } catch (error) {
        console.error("Error al guardar inspección:", error);
        throw error;
    }
};

/**
 * Firma masivamente múltiples inspecciones para un equipo
 */
export const bulkSignInspecciones = async (
    equipoId: string,
    fechas: string[],
    rol: string,
    firmaImg: string,
    usuarioNombre: string = 'Usuario Sin Nombre'
) => {
    console.log(`🛠️ [bulkSignInspecciones] Iniciando para ${fechas.length} documentos. Rol: ${rol}`);

    try {
        // Para cada fecha validamos que el operador haya cerrado el preoperacional antes
        const batch = fechas.map(async (fechaISO) => {
            const docId = `${equipoId}_${fechaISO}`;
            const ref = doc(db, "InspeccionesDiarias", docId);

            // Leemos el documento para validar estado de cierre del operador
            const snap = await getDoc(ref);
            if (!snap.exists()) {
                throw new Error(`Documento no encontrado: ${docId}`);
            }
            const data: any = snap.data();

            // Si el operador no ha marcado 'cerrado', rechazamos la operación
            if (!data?.firmas?.operador?.cerrado) {
                throw new Error(`El operador no ha cerrado el preoperacional para ${fechaISO}. Firma denegada.`);
            }

            // Mapeo de roles internos de firma
            let campoFirma = rol.toLowerCase();
            if (rol === 'SUPERVISOR') campoFirma = 'inspector';
            if (rol === 'ADMIN' || rol === 'COPAS') campoFirma = 'copas';

            console.log(`📝 Actualizando documento: ${docId}, campo: firmas.${campoFirma}`);

            const updateData: any = {
                [`firmas.${campoFirma}`]: {
                    firmado: true,
                    fecha: new Date().toISOString(),
                    firmaImg: firmaImg,
                    usuarioNombre: usuarioNombre
                },
                progresoFirmas: increment(1),
                updatedAt: serverTimestamp()
            };

            return updateDoc(ref, updateData);
        });

        await Promise.all(batch);
        console.log("✅ [bulkSignInspecciones] Todas las firmas guardadas con éxito.");
        return true;
    } catch (error) {
        console.error("❌ [bulkSignInspecciones] Error al guardar firmas:", error);
        throw error;
    }
};