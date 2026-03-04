import { collection, getDocs, query, orderBy, where, documentId, doc, getDoc } from 'firebase/firestore';
import type { Equipo, StaffMemberType } from '../../typesScript/equipoFormType';
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
    const finId = `${prefix}-31`; 

    // console.log(`📡 Firebase Query: [${inicioId}] hasta [${finId}]`);

    try {
        // Al filtrar por documentId(), Firestore no requiere índices compuestos
        const q = query(
            collection(db, "inspeccionesDiarias"),
            where(documentId(), ">=", inicioId),
            where(documentId(), "<=", finId)
        );

        const querySnapshot = await getDocs(q);
        const mapaRegistros: Record<string, any> = {};

        // console.log(`✅ Resultados Firebase para ${mes}/${anio}:`, querySnapshot.size);

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

/**
 * Obtiene todos los datos del documento de usuario en la colección "users"
 * usando el correo como identificador.
 */
// export interface StaffMemberType {
//     cedula: string;
//     fullName: string;
//     cargo?: string;
// }

export const getStaffMembers = async (): Promise<StaffMemberType[]> => {
    try {
        const staffRef = collection(db, 'staff');
        const snapshot = await getDocs(staffRef);
        return snapshot.docs.map(doc => ({
            cedula: doc.id,
            ...(doc.data() as any)
        })) as StaffMemberType[];
    } catch (error) {
        console.error('Error al obtener listado de staff:', error);
        throw error;
    }
};

export const getUserDataByEmail = async (email: string): Promise<Record<string, any> | null> => {
    try {
        const userRef = doc(db, 'users', email);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            console.warn(`Documento de usuario no encontrado para correo: ${email}`);
            return null;
        }

        return snap.data();
    } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
        throw error;
    }
};
