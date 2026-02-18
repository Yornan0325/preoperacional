import { collection, getDocs, query, orderBy } from 'firebase/firestore';
 import type { Equipo } from '../../typesScript/equipoFormType';
import { db } from '../firebase';
import type { FormatoPreoperacional } from '../../typesScript/preoperacionalType';

export const getEquiposFromFirebase = async (): Promise<Equipo[]> => {
    try {
        // Consultamos la colección ordenando por fecha de creación (opcional)
        const equiposRef = collection(db, 'equipos');
        // const q = query(equiposRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(equiposRef);
        
        // Mapeamos los documentos a objetos tipo Equipo
        const equipos = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id // Nos aseguramos de capturar el ID del documento
        })) as Equipo[];

        return equipos;
    } catch (error) {
        console.error("Error al obtener equipos de Firebase:", error);
        throw error;
    }
};

export const getFormatosFromFirebase = async (): Promise<FormatoPreoperacional[]> => {
    try {
        const formatosRef = collection(db, "plantillas_formatos");
        // Ordenamos por nombre para que la lista sea alfabética
        const q = query(formatosRef, orderBy("nombreFormato", "asc"));
        
        const querySnapshot = await getDocs(q);
        
        // Mapeamos los resultados a tu interfaz
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id // El ID es el nombre limpio que definimos antes
        })) as FormatoPreoperacional[];
    } catch (error) {
        console.error("Error al obtener formatos:", error);
        throw error;
    }
};