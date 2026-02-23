import { collection, getDocs, query, orderBy, where, documentId } from 'firebase/firestore';
import type { Equipo } from '../../typesScript/equipoFormType';
import { db } from '../firebase';
import type { FormatoPreoperacional } from '../../typesScript/preoperacionalType';

export const getEquiposFromFirebase = async (): Promise<Equipo[]> => {
    try {
        const equiposRef = collection(db, 'equipos');
        const querySnapshot = await getDocs(equiposRef);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as Equipo[];
    } catch (error) {
        console.error("Error al obtener equipos de Firebase:", error);
        throw error;
    }
};

export const getFormatosFromFirebase = async (): Promise<FormatoPreoperacional[]> => {
    try {
        const formatosRef = collection(db, "plantillas_formatos");
        const q = query(formatosRef, orderBy("nombreFormato", "asc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        })) as FormatoPreoperacional[];
    } catch (error) {
        console.error("Error al obtener formatos:", error);
        throw error;
    }
};

export const getEstadoMensualEquipos = async (equipoId: string, mes: string, anio: string) => {
    // Definimos el rango de IDs basado en el formato: IDequipo_YYYY-MM-DD
    const prefix = `${equipoId}_${anio}-${mes}`;
    const inicioId = `${prefix}-01`;
    const finId = `${prefix}-31`; // El 31 es un límite superior seguro para orden alfabético

    console.log(`📡 Firebase Query: [${inicioId}] hasta [${finId}]`);

    try {
        // Al filtrar por documentId(), Firestore no requiere índices compuestos
        const q = query(
            collection(db, "InspeccionesDiarias"),
            where(documentId(), ">=", inicioId),
            where(documentId(), "<=", finId)
        );

        const querySnapshot = await getDocs(q);
        const mapaRegistros: Record<string, any> = {};

        console.log(`✅ Resultados Firebase para ${mes}/${anio}:`, querySnapshot.size);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Descomponemos el ID de forma segura (el último _ es el separador de la fecha)
            const lastUnderscoreIndex = doc.id.lastIndexOf('_');
            const idDelEquipo = doc.id.substring(0, lastUnderscoreIndex);
            const fechaDeInspeccion = doc.id.substring(lastUnderscoreIndex + 1);

            // Usamos la fecha como llave para el mapa mensual
            const fechaKey = data.fechaInspeccion || fechaDeInspeccion;

            mapaRegistros[fechaKey] = {
                ...data,
                id: doc.id,
                equipoId: data.equipoId || idDelEquipo,
                fechaInspeccion: data.fechaInspeccion || fechaDeInspeccion
            };
        });

        return mapaRegistros;
    } catch (error) {
        console.error("❌ Error en getEstadoMensualEquipos:", error);
        throw error;
    }
};

export const getInspeccionesByEquipo = async (equipoId: string) => {
    try {
        const q = query(
            collection(db, "InspeccionesDiarias"),
            where("equipoId", "==", equipoId),
            orderBy("fechaInspeccion", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (error) {
        console.error("Error al obtener inspecciones por equipo:", error);
        if (error instanceof Error && error.message.includes("index")) {
            console.warn("Se requiere crear un ID compuesto en Firebase para equipoId y fechaInspeccion");
        }
        throw error;
    }
};