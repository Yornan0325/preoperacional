import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Equipo } from '../../typesScript/equipoFormType';
import type { FormatoCompleto } from '../../typesScript/preoperacionalType';



export const createEquipo = async (data: Omit<Equipo, 'id' | 'imagen'>) => {

    // 1. Creamos una referencia con un ID generado automáticamente
    const equipoRef = doc(collection(db, 'equipos'));
    const idGenerado = equipoRef.id;

    // 2. Guardamos los datos incluyendo el ID dentro del objeto
    await setDoc(equipoRef, {
        ...data,
        id: idGenerado, // Guardamos el ID aquí
        createdAt: serverTimestamp(),
    });

    return idGenerado;
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
    const idDocumento = data.id && data.id.length > 10 // Si es un UUID o ID de Firebase
        ? data.id 
        : crearIdLegible(data.nombreFormato);

    const formatoRef = doc(db, "plantillas_formatos", idDocumento);

    const payload = {
        ...data,
        id: idDocumento, // Ahora el ID es el nombre limpio
        nombreFormato: data.nombreFormato.toUpperCase(),
        updatedAt: serverTimestamp(),
    };

    console.log("📤 Enviando a Firebase con ID:", idDocumento);
    
    try {
        await setDoc(formatoRef, payload, { merge: true });
        return payload;
    } catch (error) {
        console.error("Error en setDoc:", error);
        throw error;
    }
};