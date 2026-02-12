import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export type EquipoPayload = {
    relacionFormato: string;
    relacionEquipo: string;
    placa: string;
    marca: string;
    modelo: string;
    serial: string;
    proyecto: string;
    ubicacion: string;
    estado: string;
    asignadoOperador: string;
};

export const createEquipo = async (data: EquipoPayload) => {
    const ref = collection(db, 'equipos');

    const doc = await addDoc(ref, {
        ...data,
        createdAt: serverTimestamp(),
    });

    return doc.id;
};