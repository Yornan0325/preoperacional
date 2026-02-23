import { collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
// import type { Equipo } from '../../typesScript/equipoFormType';
import type { FormatoCompleto } from '../../typesScript/preoperacionalType';


// Definimos y exportamos la interfaz para que el Store pueda usarla
export interface EquipoPayload {
    nombreEquipo: string;
    placa: string;
    marca: string;
    serial: string;
    relacionFormato: string; // Aquí llegará "VEHICULO_LIVIANO"
    estado: string;
    proyecto: string;
    ubicacion: string;
    asignadoOperador: {
        nombre: string;
        cargo: string;
    };
    imagen?: string;
}

// export const createEquipo = async (data: any) => {
//     try {
//         // Generamos un ID de documento basado en la placa (opcional) o dejamos que Firebase lo cree
//         const equipoRef = doc(collection(db, "equipos"), data.placa.toUpperCase());

//         const payload = {
//             ...data,
//             id: equipoRef.id,
//             // Aquí nos aseguramos de que el ID del formato sea el que viene del Select
//             relacionFormato: data.relacionFormato, 
//             updatedAt: serverTimestamp(),
//         };

//         await setDoc(equipoRef, payload, { merge: true });
//         return equipoRef.id;
//     } catch (error) {
//         console.error("Error al crear equipo:", error);
//         throw error;
//     }
// };
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